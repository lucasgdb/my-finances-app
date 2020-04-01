import React, { useState } from 'react';
import {
   SafeAreaView,
   StyleSheet,
   ScrollView,
   StatusBar,
   View,
   Text,
   TextInput,
   Alert,
} from 'react-native';

import { Toolbar, ListItem, Button } from 'react-native-material-ui';
import { TextInputMask, MaskService } from 'react-native-masked-text';
import { Colors } from 'react-native/Libraries/NewAppScreen';

import { Item } from './Interfaces';

function App() {
   const [money, setMoney] = useState('500.00');
   const [txtMoney, setTxtMoney] = useState('000');
   const [adding, setAdding] = useState(false);
   const [newMoney, setNewMoney] = useState('000');
   const [title, setTitle] = useState('');
   const [description, setDescription] = useState('');
   const [months, setMonths] = useState('1');
   const [list, setList] = useState([
      {
         title: 'Empréstimo',
         description: 'Dinheiro emprestado para a Valéria',
         value: '180.00',
         months: 5,
         missingMonths: 5,
      },
      {
         title: 'Empréstimo',
         description: 'Dinheiro emprestado para o Júnior',
         value: '800.00',
         months: 10,
         missingMonths: 10,
      },
      {
         title: 'Empréstimo',
         description: 'Dinheiro emprestado para a Steffany',
         value: '800.00',
         months: 10,
         missingMonths: 10,
      },
   ] as Item[]);

   function handleAddMoney() {
      const currentMoney = Number(money.replace(/\D/g, ''));
      const newAddMoney = Number(txtMoney.replace(/\D/g, ''));

      const finalValue = currentMoney + newAddMoney;

      setMoney(finalValue.toString());
      setTxtMoney('000');
   }

   function handleAddItem() {
      if (
         title !== '' &&
         description !== '' &&
         newMoney !== '' &&
         Number(months) > 0
      ) {
         const currentMoney = Number(money.replace(/\D/g, ''));
         const newMinusMoney = Number(newMoney.replace(/\D/g, ''));

         if (newMinusMoney <= currentMoney) {
            setList([
               ...list,
               {
                  title,
                  description,
                  value: newMoney,
                  months: Number(months),
                  missingMonths: Number(months),
               },
            ]);

            setMoney(String(currentMoney - newMinusMoney));
            setTitle('');
            setDescription('');
            setNewMoney('000');
            setMonths('1');
         } else {
            Alert.alert('Error', 'You do not have money to make this :(', [
               { text: 'OK' },
            ]);
         }

         setAdding(false);
      }
   }

   function handleRemoveItem(index: number) {
      const newList = [...list];
      const currentMoney = Number(money.replace(/\D/g, ''));
      const newMinusMoney =
         Number(newList[index].value.replace(/\D/g, '')) /
         newList[index].months;

      setMoney(String(currentMoney + newMinusMoney));

      if (newList[index].missingMonths > 1) {
         newList[index].missingMonths--;
      } else {
         newList.splice(index, 1);
      }

      setList(newList);
   }

   return (
      <>
         <StatusBar barStyle="light-content" />
         <SafeAreaView style={styles.root}>
            <ScrollView
               contentInsetAdjustmentBehavior="automatic"
               style={styles.scrollView}>
               <Toolbar leftElement="menu" centerElement="My Finances" />

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
                        onChangeText={(text) => setMoney(text)}
                        style={{ ...styles.currentMoney, ...styles.inputMask }}
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
                     <View>
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
                           <Text>Months: </Text>

                           <TextInput
                              placeholder="Months to be paid..."
                              value={months}
                              onChangeText={(text) => setMonths(text)}
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
                     </View>
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
                                          Number(item.value) / item.months,
                                       ).toFixed(2),
                                    ),
                                    {
                                       precision: 2,
                                       separator: ',',
                                       delimiter: '.',
                                       unit: 'R$ ',
                                    },
                                 )} * ${
                                    item.missingMonths
                                 } = ${MaskService.toMask(
                                    'money',
                                    String(
                                       (Number(item.value.replace(/\D/g, '')) /
                                          item.months) *
                                          item.missingMonths,
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
                              onPress={() => handleRemoveItem(index)}
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
            </ScrollView>
         </SafeAreaView>
      </>
   );
}

const styles = StyleSheet.create({
   root: {
      flex: 1,
   },
   scrollView: {
      backgroundColor: Colors.lighter,
   },
   container: {
      paddingLeft: 20,
      paddingRight: 20,
      flex: 1,
      marginTop: 10,
   },
   currentMoney: {
      fontSize: 19,
   },
   typeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
   },
   inputMask: {
      flexGrow: 1,
   },
   listItem: {
      marginTop: 15,
   },
   negativeMargin: {
      marginTop: -5,
      marginBottom: -5,
   },
});

export default App;
