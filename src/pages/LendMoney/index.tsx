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
import { Button, Card } from 'react-native-material-ui';

import { Item } from '../../shared/Interfaces';
import ParseMoney from '../../helpers/ParseMoney';
import SplitMoney from '../../helpers/SplitMoney';
import SumMoney from '../../helpers/SumMoney';
import InputMoney from '../../components/InputMoney';
import List from '../../components/List';
import Divider from '../../components/Divider';

export default function LendMoney({ navigation }: StackHeaderProps) {
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
         const currentProfit = ParseMoney(profit);
         const newAddMoney = ParseMoney(addProfit);

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
         await AsyncStorage.setItem('profit', ParseMoney(newProfit).toString());

         setProfit(newProfit);
      } catch (err) {
         Alert.alert('Error', err);
      }
   }

   async function handleAddItem() {
      try {
         const numberInstallments = Number(installments);
         const parseMoney = ParseMoney(money);
         const parseTax = ParseMoney(tax);

         if (title.trim() === '') {
            Alert.alert('Error', 'Title cannot be empty.', [{ text: 'OK' }]);
         } else if (description.trim() === '') {
            Alert.alert('Error', 'Description cannot be empty.', [
               { text: 'OK' },
            ]);
         } else if (parseMoney <= 0) {
            Alert.alert('Error', 'Money cannot be less than R$ 0,01', [
               { text: 'OK' },
            ]);
         } else if (numberInstallments <= 0) {
            Alert.alert('Error', 'Installments cannot be less than 1.', [
               { text: 'OK' },
            ]);
         } else {
            const newList = [
               ...list,
               {
                  title,
                  description,
                  money,
                  tax,
                  installments: numberInstallments,
                  missingInstallments: numberInstallments,
                  perMonth: SplitMoney(
                     parseMoney + parseTax,
                     numberInstallments,
                  ),
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

         const moneyToPay = ParseMoney(newList[index].money);

         const moneyPerInstallment =
            newList[index].perMonth[
               newList[index].installments - newList[index].missingInstallments
            ];

         const paidMoneyPerMonth = newList[index].perMonth.slice(
            0,
            newList[index].installments -
               newList[index].missingInstallments +
               1,
         );

         const paidMoney = SumMoney(paidMoneyPerMonth);

         if (paidMoney > moneyToPay) {
            const missingTax = paidMoney - moneyToPay;

            const finalValue = String(
               ParseMoney(profit) +
                  (missingTax > moneyPerInstallment
                     ? moneyPerInstallment
                     : missingTax),
            );

            await AsyncStorage.setItem('profit', finalValue);

            setProfit(finalValue);
         }

         newList[index].missingInstallments--;

         if (newList[index].missingInstallments === 0) {
            const removedItems = await AsyncStorage.getItem('trash');
            const parseRemovedItems: Item[] = [];

            if (removedItems !== null) {
               parseRemovedItems.push(...JSON.parse(removedItems));
            }

            parseRemovedItems.push(newList[index]);

            await AsyncStorage.setItem(
               'trash',
               JSON.stringify(parseRemovedItems),
            );

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
         <SafeAreaView style={{ flex: 1 }}>
            <ScrollView
               contentInsetAdjustmentBehavior="automatic"
               style={{ backgroundColor: '#191a21' }}>
               <Card style={{ container: { borderRadius: 0 } }}>
                  {loading ? (
                     <View
                        style={{
                           paddingLeft: 20,
                           paddingRight: 20,
                           paddingTop: 15,
                           paddingBottom: 15,
                           flex: 1,
                           backgroundColor: '#282a36',
                        }}>
                        <Text style={{ color: '#fafafb' }}>
                           Loading your app...
                        </Text>
                     </View>
                  ) : (
                     <View
                        style={{
                           paddingLeft: 20,
                           paddingRight: 20,
                           flex: 1,
                           backgroundColor: '#282a36',
                        }}>
                        <View
                           style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              marginTop: 5,
                           }}>
                           <Text style={{ fontSize: 19, color: '#fafafb' }}>
                              Your current profit:
                           </Text>

                           <InputMoney
                              value={profit}
                              onChangeText={(text: string) =>
                                 handleChangeProfit(text)
                              }
                              style={{
                                 fontSize: 19,
                                 flexGrow: 1,
                                 color: '#fafafb',
                                 paddingTop: 5,
                                 paddingBottom: 5,
                                 marginLeft: 5,
                              }}
                           />
                        </View>

                        <View
                           style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              marginTop: 5,
                              marginBottom: 10,
                           }}>
                           <Text style={{ color: '#fafafb', paddingRight: 7 }}>
                              Amount:
                           </Text>

                           <InputMoney
                              value={addProfit}
                              onChangeText={(text) => setAddProfit(text)}
                              style={{
                                 flexGrow: 1,
                                 color: '#fafafb',
                                 backgroundColor: '#343746',
                                 height: 35,
                                 paddingTop: 5,
                                 paddingBottom: 5,
                                 paddingLeft: 7,
                                 marginLeft: 5,
                                 marginRight: 5,
                              }}
                           />

                           <Button
                              icon="attach-money"
                              upperCase={false}
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
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginTop: 5,
                                    marginBottom: 7,
                                 }}>
                                 <Text
                                    style={{
                                       color: '#fafafb',
                                       textAlign: 'right',
                                       paddingRight: 7,
                                       width: 90,
                                    }}>
                                    Title:
                                 </Text>

                                 <TextInput
                                    placeholder="Type the title here..."
                                    value={title}
                                    onChangeText={(text) => setTitle(text)}
                                    placeholderTextColor="#555"
                                    style={{
                                       flexGrow: 1,
                                       color: '#fafafb',
                                       backgroundColor: '#343746',
                                       height: 35,
                                       paddingTop: 5,
                                       paddingBottom: 5,
                                       paddingLeft: 7,
                                       marginLeft: 5,
                                    }}
                                 />
                              </View>

                              <Divider light />

                              <View
                                 style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginTop: 7,
                                    marginBottom: 7,
                                 }}>
                                 <Text
                                    style={{
                                       color: '#fafafb',
                                       textAlign: 'right',
                                       paddingRight: 7,
                                       width: 90,
                                    }}>
                                    Description:
                                 </Text>

                                 <TextInput
                                    placeholder="Type the description here..."
                                    value={description}
                                    onChangeText={(text) =>
                                       setDescription(text)
                                    }
                                    placeholderTextColor="#555"
                                    style={{
                                       flexGrow: 1,
                                       color: '#fafafb',
                                       backgroundColor: '#343746',
                                       height: 35,
                                       paddingTop: 5,
                                       paddingBottom: 5,
                                       paddingLeft: 7,
                                       marginLeft: 5,
                                    }}
                                 />
                              </View>

                              <Divider light />

                              <View
                                 style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginTop: 7,
                                    marginBottom: 7,
                                 }}>
                                 <Text
                                    style={{
                                       color: '#fafafb',
                                       textAlign: 'right',
                                       paddingRight: 7,
                                       width: 90,
                                    }}>
                                    Value:
                                 </Text>

                                 <InputMoney
                                    value={money}
                                    onChangeText={(text) => setMoney(text)}
                                    style={{
                                       flexGrow: 1,
                                       color: '#fafafb',
                                       backgroundColor: '#343746',
                                       height: 35,
                                       paddingTop: 5,
                                       paddingBottom: 5,
                                       paddingLeft: 7,
                                       marginLeft: 5,
                                    }}
                                 />
                              </View>

                              <Divider light />

                              <View
                                 style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginTop: 7,
                                    marginBottom: 7,
                                 }}>
                                 <Text
                                    style={{
                                       color: '#fafafb',
                                       textAlign: 'right',
                                       paddingRight: 7,
                                       width: 90,
                                    }}>
                                    Tax:
                                 </Text>

                                 <InputMoney
                                    value={tax}
                                    onChangeText={(text) => setTax(text)}
                                    style={{
                                       flexGrow: 1,
                                       color: '#fafafb',
                                       backgroundColor: '#343746',
                                       height: 35,
                                       paddingTop: 5,
                                       paddingBottom: 5,
                                       paddingLeft: 7,
                                       marginLeft: 5,
                                    }}
                                 />
                              </View>

                              <Divider light />

                              <View
                                 style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginTop: 7,
                                    marginBottom: 7,
                                 }}>
                                 <Text
                                    style={{
                                       color: '#fafafb',
                                       textAlign: 'right',
                                       paddingRight: 7,
                                       width: 90,
                                    }}>
                                    Installments:
                                 </Text>

                                 <TextInput
                                    placeholder="Installments to be paid..."
                                    value={installments}
                                    onChangeText={(text) =>
                                       setInstallments(text)
                                    }
                                    placeholderTextColor="#555"
                                    style={{
                                       flexGrow: 1,
                                       color: '#fafafb',
                                       backgroundColor: '#343746',
                                       height: 35,
                                       paddingTop: 5,
                                       paddingBottom: 5,
                                       paddingLeft: 7,
                                       marginLeft: 5,
                                    }}
                                    keyboardType="numeric"
                                 />
                              </View>

                              <View>
                                 <Button
                                    icon="clear"
                                    upperCase={false}
                                    accent
                                    raised
                                    text="Cancel"
                                    onPress={() => setAdding(false)}
                                    style={{
                                       container: { marginTop: 7 },
                                    }}
                                 />

                                 <Button
                                    icon="save"
                                    upperCase={false}
                                    primary
                                    raised
                                    text="Add"
                                    onPress={handleAddItem}
                                    style={{
                                       container: {
                                          marginTop: 5,
                                          marginBottom: 15,
                                          backgroundColor: '#00ff5f',
                                       },
                                       text: { color: '#333' },
                                    }}
                                 />
                              </View>
                           </>
                        ) : (
                           <Button
                              icon="add"
                              upperCase={false}
                              primary
                              text="Add new item"
                              raised
                              onPress={() => setAdding(true)}
                              style={{
                                 container: {
                                    backgroundColor: '#00ff5f',
                                    marginTop: 5,
                                    marginBottom: 15,
                                 },
                                 text: { color: '#333' },
                              }}
                           />
                        )}
                     </View>
                  )}
               </Card>

               {!loading && (
                  <View
                     style={{
                        marginBottom: 5,
                        marginLeft: 20,
                        marginRight: 20,
                     }}>
                     {list.length ? (
                        list.map((item: Item, index: number) => (
                           <List
                              key={index}
                              item={item}
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
                              style={{
                                 container: { backgroundColor: '#282a36' },
                                 primaryText: { color: '#fafafb' },
                                 secondaryText: { color: '#777' },
                                 tertiaryText: { color: '#777' },
                                 rightElement: { color: '#fafafb' },
                              }}
                           />
                        ))
                     ) : (
                        <View style={{ marginTop: 5, marginBottom: 5 }}>
                           <Text style={{ color: '#fafafb' }}>
                              There is no lent money here.
                           </Text>
                        </View>
                     )}
                  </View>
               )}
            </ScrollView>

            <ActionButton
               icon="delete"
               style={{
                  container: { backgroundColor: '#00ff5f' },
                  icon: { color: '#333' },
               }}
               onPress={() =>
                  navigation.navigate('Trash can', { handleUpdateItems })
               }
            />
         </SafeAreaView>
      </>
   );
}
