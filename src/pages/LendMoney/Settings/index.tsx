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
import { StackHeaderProps } from '@react-navigation/stack';
import { Button, Card, Divider } from 'react-native-material-ui';

import { Item } from '../../../shared/Interfaces';
import ParseMoney from '../../../helpers/ParseMoney';
import InputMoney from '../../../components/InputMoney';

// @ts-ignore
export default function Settings({ route, navigation }: StackHeaderProps) {
   const { item, handleUpdateItems } = route.params;

   const [loading, setLoading] = useState(true);
   const [title, setTitle] = useState('');
   const [description, setDescription] = useState('');
   const [installments, setInstallments] = useState('1');
   const [money, setMoney] = useState('000');
   const [tax, setTax] = useState('000');
   const [missingInstallments, setMissingInstallments] = useState('1');

   useEffect(() => {
      (async function () {
         try {
            const currentList = await AsyncStorage.getItem('list');

            if (currentList !== null) {
               const list: Item = JSON.parse(currentList)[item];

               setTitle(list.title);
               setDescription(list.description);
               setMoney(list.money);
               setTax(list.tax);
               setInstallments(String(list.installments));
               setMissingInstallments(String(list.missingInstallments));
            }
         } catch (err) {
            try {
               AsyncStorage.clear();
            } catch {}

            Alert.alert('Error', err);
         } finally {
            setLoading(false);
         }
      })();
   }, [item]);

   async function handleSaveItem() {
      try {
         if (
            title !== '' &&
            description !== '' &&
            money !== '' &&
            ParseMoney(money) > 0 &&
            Number(installments) > 0 &&
            Number(missingInstallments) > 0
         ) {
            const newList: Item = {
               title,
               description,
               money,
               tax,
               installments: ParseMoney(installments),
               missingInstallments: ParseMoney(missingInstallments),
            };

            const list = await AsyncStorage.getItem('list');

            if (list !== null) {
               const currentList = JSON.parse(list);

               currentList[item] = newList;

               await AsyncStorage.setItem('list', JSON.stringify(currentList));

               handleUpdateItems();

               navigation.navigate('LendMoney');
            }
         }
      } catch (err) {
         Alert.alert('Error', err);
      }
   }

   async function handleRemoveItem() {
      try {
         const list = await AsyncStorage.getItem('list');

         if (list !== null) {
            const currentList = JSON.parse(list);

            const trashList = await AsyncStorage.getItem('trash');
            const trash = currentList.splice(item, 1);
            const currentTrashList = [] as Item[];

            if (trashList !== null) {
               currentTrashList.push(...JSON.parse(trashList));
            }

            currentTrashList.push(...trash);

            await AsyncStorage.setItem(
               'trash',
               JSON.stringify(currentTrashList),
            );
            await AsyncStorage.setItem('list', JSON.stringify(currentList));

            handleUpdateItems();

            navigation.navigate('LendMoney');
         }
      } catch (err) {
         Alert.alert('Error', err);
      }
   }

   function handleAskRemoveItem() {
      Alert.alert('Remove', 'Do you want to remove this item?', [
         { text: 'No' },
         { text: 'Yes', onPress: handleRemoveItem },
      ]);
   }

   return (
      <>
         <StatusBar backgroundColor="#00ff5f" barStyle="dark-content" />
         <SafeAreaView style={{ flex: 1 }}>
            <ScrollView
               contentInsetAdjustmentBehavior="automatic"
               style={{ backgroundColor: '#191a21' }}>
               {loading ? (
                  <Text>Loading...</Text>
               ) : (
                  <>
                     <Card
                        style={{
                           container: {
                              paddingTop: 10,
                              paddingBottom: 10,
                              backgroundColor: '#282a36',
                           },
                        }}>
                        <View
                           style={{
                              paddingLeft: 20,
                              paddingRight: 20,
                              flex: 1,
                           }}>
                           <View
                              style={{
                                 flexDirection: 'row',
                                 alignItems: 'center',
                                 marginTop: -5,
                                 marginBottom: -5,
                              }}>
                              <Text style={{ color: '#fafafb' }}>Title: </Text>

                              <TextInput
                                 placeholder="Type the title here..."
                                 value={title}
                                 onChangeText={(text) => setTitle(text)}
                                 placeholderTextColor="#575757"
                                 style={{ flexGrow: 1, color: '#fafafb' }}
                              />
                           </View>

                           <Divider />

                           <View
                              style={{
                                 flexDirection: 'row',
                                 alignItems: 'center',
                                 marginTop: -5,
                                 marginBottom: -5,
                              }}>
                              <Text style={{ color: '#fafafb' }}>
                                 Description:{' '}
                              </Text>

                              <TextInput
                                 placeholder="Type the title here..."
                                 value={description}
                                 onChangeText={(text) => setDescription(text)}
                                 placeholderTextColor="#575757"
                                 style={{ flexGrow: 1, color: '#fafafb' }}
                              />
                           </View>

                           <Divider />

                           <View
                              style={{
                                 flexDirection: 'row',
                                 alignItems: 'center',
                                 marginTop: -5,
                                 marginBottom: -5,
                              }}>
                              <Text style={{ color: '#fafafb' }}>Value: </Text>

                              <InputMoney
                                 value={money}
                                 onChangeText={(text: string) => setMoney(text)}
                                 style={{ flexGrow: 1, color: '#fafafb' }}
                              />
                           </View>

                           <Divider />

                           <View
                              style={{
                                 flexDirection: 'row',
                                 alignItems: 'center',
                                 marginTop: -5,
                                 marginBottom: -5,
                              }}>
                              <Text style={{ color: '#fafafb' }}>Tax: </Text>

                              <InputMoney
                                 value={tax}
                                 onChangeText={(text: string) => setTax(text)}
                                 style={{ flexGrow: 1, color: '#fafafb' }}
                              />
                           </View>

                           <Divider />

                           <View
                              style={{
                                 flexDirection: 'row',
                                 alignItems: 'center',
                                 marginTop: -5,
                                 marginBottom: -5,
                              }}>
                              <Text style={{ color: '#fafafb' }}>
                                 Installments:{' '}
                              </Text>

                              <TextInput
                                 placeholder="Installments to be paid..."
                                 value={installments}
                                 onChangeText={(text) => setInstallments(text)}
                                 style={{ flexGrow: 1, color: '#fafafb' }}
                                 placeholderTextColor="#575757"
                                 keyboardType="numeric"
                              />
                           </View>

                           <Divider />

                           <View
                              style={{
                                 flexDirection: 'row',
                                 alignItems: 'center',
                                 marginTop: -5,
                                 marginBottom: -5,
                              }}>
                              <Text style={{ color: '#fafafb' }}>
                                 Missing installments:{' '}
                              </Text>

                              <TextInput
                                 placeholder="Missing installments..."
                                 value={missingInstallments}
                                 onChangeText={(text) =>
                                    setMissingInstallments(text)
                                 }
                                 style={{ flexGrow: 1, color: '#fafafb' }}
                                 placeholderTextColor="#575757"
                                 keyboardType="numeric"
                              />
                           </View>
                        </View>
                     </Card>

                     <Button
                        accent
                        raised
                        text="Remove"
                        onPress={handleAskRemoveItem}
                        style={{
                           container: {
                              marginTop: 5,
                              marginLeft: 15,
                              marginRight: 15,
                           },
                        }}
                     />

                     <Button
                        primary
                        raised
                        text="Save"
                        onPress={handleSaveItem}
                        style={{
                           container: {
                              marginTop: 5,
                              backgroundColor: '#00ff5f',
                              marginLeft: 15,
                              marginRight: 15,
                           },
                           text: { color: '#333' },
                        }}
                     />
                  </>
               )}
            </ScrollView>
         </SafeAreaView>
      </>
   );
}
