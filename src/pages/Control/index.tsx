import React, { useState, useEffect, useCallback } from 'react';
import {
   SafeAreaView,
   ScrollView,
   StatusBar,
   View,
   Text,
   TextInput,
   Alert,
} from 'react-native';
import { StackHeaderProps } from '@react-navigation/stack';

import AsyncStorage from '@react-native-community/async-storage';
import { Toolbar, ListItem, Button } from 'react-native-material-ui';
import { TextInputMask, MaskService } from 'react-native-masked-text';

import styles from './styles';
import { Item } from './Interfaces';

export default function Control({ navigation }: StackHeaderProps) {
   const [loading, setLoading] = useState(true);
   const [money, setMoney] = useState('950.00');
   const [txtMoney, setTxtMoney] = useState('000');
   const [adding, setAdding] = useState(false);
   const [newMoney, setNewMoney] = useState('000');
   const [title, setTitle] = useState('');
   const [description, setDescription] = useState('');
   const [installments, setInstallments] = useState('1');
   const [list, setList] = useState([
      // {
      //    title: 'Empréstimo',
      //    description: 'Dinheiro emprestado para a Valéria',
      //    value: '180.00',
      //    installments: 5,
      //    missingInstallments: 5,
      // },
      // {
      //    title: 'Empréstimo',
      //    description: 'Dinheiro emprestado para o Júnior',
      //    value: '800.00',
      //    installments: 10,
      //    missingInstallments: 10,
      // },
   ] as Item[]);

   useEffect(() => {
      (async function () {
         try {
            const currentMoney = await AsyncStorage.getItem('money');
            const currentList = await AsyncStorage.getItem('list');

            if (currentMoney !== null) setMoney(currentMoney);
            if (currentList !== null) setList(JSON.parse(currentList));
         } catch (err) {
            Alert.alert('Error', err);
         } finally {
            setLoading(false);
         }
      })();
   }, []);

   async function handleAddMoney() {
      try {
         const currentMoney = Number(money.replace(/\D/g, ''));
         const newAddMoney = Number(txtMoney.replace(/\D/g, ''));

         const finalValue = String(currentMoney + newAddMoney);

         await AsyncStorage.setItem('money', finalValue);

         setMoney(finalValue);
         setTxtMoney('000');
      } catch (err) {
         Alert.alert('Error', err);
      }
   }

   async function handleChangeMoney(money: string) {
      try {
         await AsyncStorage.setItem('money', money.replace(/\D/g, ''));

         setMoney(money);
      } catch (err) {
         Alert.alert('Error', err);
      }
   }

   async function handleAddItem() {
      try {
         if (
            title !== '' &&
            description !== '' &&
            newMoney !== '' &&
            Number(installments) > 0
         ) {
            const currentMoney = Number(money.replace(/\D/g, ''));
            const newMinusMoney = Number(newMoney.replace(/\D/g, ''));

            if (newMinusMoney <= currentMoney) {
               const newList = [
                  ...list,
                  {
                     title,
                     description,
                     value: newMoney,
                     installments: Number(installments),
                     missingInstallments: Number(installments),
                  },
               ];

               await AsyncStorage.setItem('list', JSON.stringify(newList));

               setList(newList);

               const finalValue = String(currentMoney - newMinusMoney);

               await AsyncStorage.setItem('money', finalValue);

               setMoney(finalValue);
               setTitle('');
               setDescription('');
               setNewMoney('000');
               setInstallments('1');
            } else {
               Alert.alert('Error', 'You do not have money to make this :(', [
                  { text: 'OK' },
               ]);
            }

            setAdding(false);
         }
      } catch (err) {
         Alert.alert('Error', err);
      }
   }

   async function handleRemoveItem(index: number) {
      try {
         const newList = [...list];
         const currentMoney = Number(money.replace(/\D/g, ''));
         const newMinusMoney =
            Number(newList[index].value.replace(/\D/g, '')) /
            newList[index].installments;

         const finalValue = String(currentMoney + newMinusMoney);

         await AsyncStorage.setItem('money', finalValue);

         setMoney(finalValue);

         if (newList[index].missingInstallments > 1) {
            newList[index].missingInstallments--;
         } else {
            newList.splice(index, 1);
         }

         await AsyncStorage.setItem('list', JSON.stringify(newList));

         setList(newList);
      } catch (err) {
         Alert.alert('Error', err);
      }
   }

   const handleUpdateItems = useCallback(async () => {
      try {
         const updatedList = await AsyncStorage.getItem('list');

         if (updatedList !== null) {
            setList(JSON.parse(updatedList));
         }
      } catch (err) {
         Alert.alert('Error', err);
      }
   }, []);

   return (
      <>
         <StatusBar backgroundColor="#2196f3" barStyle="light-content" />
         <SafeAreaView style={styles.root}>
            <ScrollView
               contentInsetAdjustmentBehavior="automatic"
               style={styles.scrollView}>
               <Toolbar leftElement="menu" centerElement="My Finances" />

               {loading ? (
                  <View style={styles.container}>
                     <Text>Loading your app...</Text>
                  </View>
               ) : (
                  <View style={styles.container}>
                     <View style={styles.typeContainer}>
                        <Text style={styles.currentMoney}>
                           Your current money: R$
                        </Text>

                        <TextInputMask
                           type="money"
                           options={{
                              precision: 2,
                              separator: ',',
                              delimiter: '.',
                              unit: '',
                           }}
                           value={money}
                           onChangeText={(text) => handleChangeMoney(text)}
                           style={{
                              ...styles.currentMoney,
                              ...styles.inputMask,
                           }}
                        />
                     </View>

                     <View style={styles.typeContainer}>
                        <Text>Amount: R$ </Text>

                        <TextInputMask
                           type="money"
                           options={{
                              precision: 2,
                              separator: ',',
                              delimiter: '.',
                              unit: '',
                           }}
                           value={txtMoney}
                           onChangeText={(text) => setTxtMoney(text)}
                           style={styles.inputMask}
                        />

                        <Button
                           raised
                           primary
                           text="Add money"
                           onPress={handleAddMoney}
                        />
                     </View>

                     {adding ? (
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
                                 value={newMoney}
                                 onChangeText={(text) => setNewMoney(text)}
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

                           <Button
                              primary
                              raised
                              text="Add"
                              onPress={handleAddItem}
                              style={{ container: { marginTop: 5 } }}
                           />
                        </>
                     ) : (
                        <Button
                           primary
                           text="Add new item"
                           raised
                           onPress={() => setAdding(true)}
                        />
                     )}

                     <View style={styles.listItem}>
                        {list.length ? (
                           list.map((item: Item, index: number) => (
                              <ListItem
                                 key={index}
                                 centerElement={{
                                    primaryText: item.title,
                                    secondaryText: item.description,
                                    tertiaryText: `${MaskService.toMask(
                                       'money',
                                       String(
                                          Number(
                                             item.value.replace(/\D/g, ''),
                                          ) / item.installments,
                                       ),
                                       {
                                          precision: 2,
                                          separator: ',',
                                          delimiter: '.',
                                          unit: 'R$ ',
                                       },
                                    )} * ${
                                       item.missingInstallments
                                    } = ${MaskService.toMask(
                                       'money',
                                       String(
                                          (Number(
                                             item.value.replace(/\D/g, ''),
                                          ) /
                                             item.installments) *
                                             item.missingInstallments,
                                       ),
                                       {
                                          precision: 2,
                                          separator: ',',
                                          delimiter: '.',
                                          unit: 'R$ ',
                                       },
                                    )}`,
                                 }}
                                 rightElement="exposure-neg-1"
                                 onPress={() =>
                                    navigation.navigate('Settings', {
                                       item: index,
                                       handleUpdateItems,
                                    })
                                 }
                                 onRightElementPress={() =>
                                    handleRemoveItem(index)
                                 }
                                 divider
                              />
                           ))
                        ) : (
                           <Text>It's okay. :)</Text>
                        )}
                     </View>
                  </View>
               )}
            </ScrollView>
         </SafeAreaView>
      </>
   );
}
