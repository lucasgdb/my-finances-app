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
import { ActionButton } from 'react-native-material-ui';
import AsyncStorage from '@react-native-community/async-storage';
import {
   Toolbar,
   ListItem,
   Button,
   Card,
   Divider,
} from 'react-native-material-ui';
import { TextInputMask, MaskService } from 'react-native-masked-text';

import styles from './styles';
import { Item } from './Interfaces';

export default function Control({ navigation }: StackHeaderProps) {
   const [loading, setLoading] = useState(true);
   const [profit, setProfit] = useState('000');
   const [addProfit, setAddProfit] = useState('000');
   const [adding, setAdding] = useState(false);
   const [money, setMoney] = useState('000');
   const [title, setTitle] = useState('');
   const [description, setDescription] = useState('');
   const [tax, setTax] = useState('000');
   const [installments, setInstallments] = useState('1');
   const [list, setList] = useState([] as Item[]);

   useEffect(() => {
      (async function () {
         try {
            const currentProfit = await AsyncStorage.getItem('profit');
            const currentList = await AsyncStorage.getItem('list');

            if (currentProfit !== null) {
               setProfit(currentProfit);
            }

            if (currentList !== null) {
               setList(JSON.parse(currentList));
            }
         } catch (err) {
            await AsyncStorage.clear();

            Alert.alert('Error', err);
         } finally {
            setLoading(false);
         }
      })();
   }, []);

   async function handleAddProfit() {
      try {
         const currentProfit = Number(profit.replace(/\D/g, ''));
         const newAddMoney = Number(addProfit.replace(/\D/g, ''));

         const finalValue = String(currentProfit + newAddMoney);

         await AsyncStorage.setItem('profit', finalValue);

         setProfit(finalValue);
         setAddProfit('000');
      } catch (err) {
         Alert.alert('Error', err);
      }
   }

   async function handleChangeProfit(newProfit: string) {
      try {
         await AsyncStorage.setItem('profit', newProfit.replace(/\D/g, ''));

         setProfit(newProfit);
      } catch (err) {
         Alert.alert('Error', err);
      }
   }

   async function handleAddItem() {
      try {
         if (
            title !== '' &&
            description !== '' &&
            money !== '' &&
            Number(money.replace(/\D/g, '')) > 0 &&
            Number(installments) > 0
         ) {
            const newList = [
               ...list,
               {
                  title,
                  description,
                  money,
                  tax,
                  installments: Number(installments),
                  missingInstallments: Number(installments),
               },
            ];

            await AsyncStorage.setItem('list', JSON.stringify(newList));

            setList(newList);

            setTitle('');
            setDescription('');
            setMoney('000');
            setTax('000');
            setInstallments('1');
            setAdding(false);
         }
      } catch (err) {
         Alert.alert('Error', err);
      }
   }

   async function handleRemoveItem(index: number) {
      try {
         const newList = [...list];

         const paidInstallments =
            newList[index].installments -
            (newList[index].missingInstallments - 1);

         const moneyToPay = Number(newList[index].money.replace(/\D/g, ''));
         const taxToPay = Number(newList[index].tax.replace(/\D/g, ''));
         const total = moneyToPay + taxToPay;

         const moneyPerInstallment = total / newList[index].installments;

         const paidMoney = paidInstallments * moneyPerInstallment;

         if (paidMoney > moneyToPay) {
            const missingTax = paidMoney - moneyToPay;

            const finalValue = String(
               Number(profit.replace(/\D/g, '')) +
                  (missingTax > moneyPerInstallment
                     ? moneyPerInstallment
                     : missingTax),
            );

            await AsyncStorage.setItem('profit', finalValue);

            setProfit(finalValue);
         }

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
         <StatusBar backgroundColor="#00ff5f" barStyle="dark-content" />
         <SafeAreaView style={styles.root}>
            <ScrollView
               contentInsetAdjustmentBehavior="automatic"
               style={styles.scrollView}>
               <Toolbar
                  leftElement="menu"
                  centerElement="My Finances"
                  style={{
                     container: { backgroundColor: '#00ff5f' },
                     titleText: { color: '#333' },
                     leftElement: { color: '#333' },
                  }}
               />

               <Card>
                  {loading ? (
                     <View style={styles.container}>
                        <Text>Loading your app...</Text>
                     </View>
                  ) : (
                     <View style={styles.container}>
                        <View style={styles.typeContainer}>
                           <Text style={styles.currentMoney}>
                              Your current profit: R$
                           </Text>

                           <TextInputMask
                              type="money"
                              options={{
                                 precision: 2,
                                 separator: ',',
                                 delimiter: '.',
                                 unit: '',
                              }}
                              value={profit}
                              onChangeText={(text) => handleChangeProfit(text)}
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
                              value={addProfit}
                              onChangeText={(text) => setAddProfit(text)}
                              style={styles.inputMask}
                           />

                           <Button
                              raised
                              primary
                              text="Add profit"
                              onPress={handleAddProfit}
                              style={{
                                 container: { backgroundColor: '#00ff5f' },
                                 text: { color: '#333' },
                              }}
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

                              <Divider />

                              <View
                                 style={{
                                    ...styles.typeContainer,
                                    ...styles.negativeMargin,
                                 }}>
                                 <Text>Description: </Text>

                                 <TextInput
                                    placeholder="Type the title here..."
                                    value={description}
                                    onChangeText={(text) =>
                                       setDescription(text)
                                    }
                                    style={styles.inputMask}
                                 />
                              </View>

                              <Divider />

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

                              <Divider />

                              <View
                                 style={{
                                    ...styles.typeContainer,
                                    ...styles.negativeMargin,
                                 }}>
                                 <Text>Tax: R$ </Text>

                                 <TextInputMask
                                    type="money"
                                    options={{
                                       precision: 2,
                                       separator: ',',
                                       delimiter: '.',
                                       unit: '',
                                    }}
                                    value={tax}
                                    onChangeText={(text) => setTax(text)}
                                    style={styles.inputMask}
                                 />
                              </View>

                              <Divider />

                              <View
                                 style={{
                                    ...styles.typeContainer,
                                    ...styles.negativeMargin,
                                 }}>
                                 <Text>Installments: </Text>

                                 <TextInput
                                    placeholder="Installments to be paid..."
                                    value={installments}
                                    onChangeText={(text) =>
                                       setInstallments(text)
                                    }
                                    style={styles.inputMask}
                                    keyboardType="numeric"
                                 />
                              </View>

                              <View style={styles.buttonContainer}>
                                 <Button
                                    accent
                                    raised
                                    text="Cancel"
                                    onPress={() => setAdding(false)}
                                    style={{
                                       container: { marginTop: 5 },
                                    }}
                                 />

                                 <Button
                                    primary
                                    raised
                                    text="Add"
                                    onPress={handleAddItem}
                                    style={{
                                       container: {
                                          marginTop: 5,
                                          backgroundColor: '#00ff5f',
                                       },
                                       text: { color: '#333' },
                                    }}
                                 />
                              </View>
                           </>
                        ) : (
                           <Button
                              primary
                              text="Add new item"
                              raised
                              onPress={() => setAdding(true)}
                              style={{
                                 container: {
                                    backgroundColor: '#00ff5f',
                                 },
                                 text: { color: '#333' },
                              }}
                           />
                        )}

                        <View style={styles.listItem}>
                           {list.length ? (
                              list.map((item: Item, index: number) => (
                                 <Card
                                    key={index}
                                    style={{
                                       container: {
                                          marginLeft: 0,
                                          marginRight: 0,
                                       },
                                    }}>
                                    <ListItem
                                       leftElement="settings"
                                       centerElement={{
                                          primaryText: item.title,
                                          secondaryText: item.description,
                                          tertiaryText: `${MaskService.toMask(
                                             'money',
                                             String(
                                                (Number(
                                                   item.money.replace(
                                                      /\D/g,
                                                      '',
                                                   ),
                                                ) +
                                                   Number(
                                                      item.tax.replace(
                                                         /\D/g,
                                                         '',
                                                      ),
                                                   )) /
                                                   item.installments,
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
                                                ((Number(
                                                   item.money.replace(
                                                      /\D/g,
                                                      '',
                                                   ),
                                                ) +
                                                   Number(
                                                      item.tax.replace(
                                                         /\D/g,
                                                         '',
                                                      ),
                                                   )) /
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
                                       onPress={() =>
                                          navigation.navigate('Settings', {
                                             item: index,
                                             handleUpdateItems,
                                          })
                                       }
                                       rightElement="exposure-neg-1"
                                       onRightElementPress={() =>
                                          handleRemoveItem(index)
                                       }
                                       divider
                                    />
                                 </Card>
                              ))
                           ) : (
                              <View style={styles.listItem}>
                                 <Text>There are no payments here.</Text>
                              </View>
                           )}
                        </View>
                     </View>
                  )}
               </Card>
            </ScrollView>

            <ActionButton
               icon="delete"
               style={{
                  container: { backgroundColor: '#00ff5f' },
                  icon: { color: '#333' },
               }}
               onPress={() =>
                  navigation.navigate('Trash', { handleUpdateItems })
               }
            />
         </SafeAreaView>
      </>
   );
}
