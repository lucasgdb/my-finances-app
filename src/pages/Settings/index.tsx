import React, { useState, useEffect } from 'react';
import {
   View,
   Text,
   StatusBar,
   SafeAreaView,
   ScrollView,
   Alert,
   TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import styles from './styles';
import { Item } from '../Control/Interfaces';
import { Button } from 'react-native-material-ui';
import { TextInputMask } from 'react-native-masked-text';

export default function Settings({ route }) {
   const { item, handleUpdateItems } = route.params;

   const [loading, setLoading] = useState(true);
   const [title, setTitle] = useState('');
   const [description, setDescription] = useState('');
   const [installments, setInstallments] = useState('1');
   const [money, setMoney] = useState('000');
   const [missingInstallments, setMissingInstallments] = useState('1');

   useEffect(() => {
      (async function () {
         try {
            const currentList = await AsyncStorage.getItem('list');

            if (currentList !== null) {
               const list: Item = JSON.parse(currentList)[item];

               setTitle(list.title);
               setDescription(list.description);
               setMoney(list.value);
               setInstallments(String(list.installments));
               setMissingInstallments(String(list.missingInstallments));
            }
         } catch (err) {
            Alert.alert('Error', err);
         } finally {
            setLoading(false);
         }
      })();
   }, []);

   async function handleSaveItem() {
      try {
         const newList: Item = {
            title,
            description,
            value: money,
            installments: Number(installments.replace(/\D/g, '')),
            missingInstallments: Number(missingInstallments.replace(/\D/g, '')),
         };

         const list = await AsyncStorage.getItem('list');

         if (list !== null) {
            const currentList = JSON.parse(list);

            currentList[item] = newList;

            await AsyncStorage.setItem('list', JSON.stringify(currentList));

            handleUpdateItems();
         }
      } catch (err) {
         Alert.alert('Error', err);
      }
   }

   return (
      <>
         <StatusBar backgroundColor="#2196f3" barStyle="light-content" />
         <SafeAreaView style={styles.root}>
            <ScrollView
               contentInsetAdjustmentBehavior="automatic"
               style={styles.scrollView}>
               <View style={styles.container}>
                  {loading ? (
                     <Text>Loading...</Text>
                  ) : (
                     <>
                        <View
                           style={{
                              ...styles.typeContainer,
                              ...styles.negativeMargin,
                           }}>
                           <Text>Title: </Text>

                           <TextInput
                              placeholder="Type the title here..."
                              value={title}
                              onChangeText={(text) => setTitle(text)}
                              style={styles.inputMask}
                           />
                        </View>

                        <View
                           style={{
                              ...styles.typeContainer,
                              ...styles.negativeMargin,
                           }}>
                           <Text>Description: </Text>

                           <TextInput
                              placeholder="Type the title here..."
                              value={description}
                              onChangeText={(text) => setDescription(text)}
                              style={styles.inputMask}
                           />
                        </View>

                        <View
                           style={{
                              ...styles.typeContainer,
                              ...styles.negativeMargin,
                           }}>
                           <Text>Value: R$ </Text>

                           <TextInputMask
                              type="money"
                              options={{
                                 precision: 2,
                                 separator: ',',
                                 delimiter: '.',
                                 unit: '',
                              }}
                              value={money}
                              onChangeText={(text) => setMoney(text)}
                              style={styles.inputMask}
                           />
                        </View>

                        <View
                           style={{
                              ...styles.typeContainer,
                              ...styles.negativeMargin,
                           }}>
                           <Text>Installments: </Text>

                           <TextInput
                              placeholder="Installments to be paid..."
                              value={installments}
                              onChangeText={(text) => setInstallments(text)}
                              style={styles.inputMask}
                              keyboardType="numeric"
                           />
                        </View>

                        <View
                           style={{
                              ...styles.typeContainer,
                              ...styles.negativeMargin,
                           }}>
                           <Text>Missing installments: </Text>

                           <TextInput
                              placeholder="Missing installments..."
                              value={missingInstallments}
                              onChangeText={(text) =>
                                 setMissingInstallments(text)
                              }
                              style={styles.inputMask}
                              keyboardType="numeric"
                           />
                        </View>

                        <Button
                           primary
                           raised
                           text="Save"
                           onPress={handleSaveItem}
                           style={{ container: { marginTop: 5 } }}
                        />
                     </>
                  )}
               </View>
            </ScrollView>
         </SafeAreaView>
      </>
   );
}
