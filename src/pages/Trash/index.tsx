import React, { useState, useEffect } from 'react';
import {
   View,
   SafeAreaView,
   StatusBar,
   ScrollView,
   Text,
   Alert,
} from 'react-native';

import styles from './styles';
import { Card, ListItem } from 'react-native-material-ui';
import { MaskService } from 'react-native-masked-text';
import { Item } from '../Control/Interfaces';
import AsyncStorage from '@react-native-community/async-storage';

// @ts-ignore
export default function Trash({ route }) {
   const { handleUpdateItems } = route.params;

   const [loading, setLoading] = useState(true);
   const [list, setList] = useState([] as Item[]);

   useEffect(() => {
      (async function () {
         try {
            const removedItems = await AsyncStorage.getItem('trash');

            if (removedItems !== null) {
               const removedList = JSON.parse(removedItems);

               setList(removedList);
            }
         } catch (err) {
            Alert.alert('Error', err);
         } finally {
            setLoading(false);
         }
      })();
   }, []);

   async function handleRemoveItem(index: number) {
      try {
         const newList = [...list];

         newList.splice(index, 1);

         await AsyncStorage.setItem('trash', JSON.stringify(newList));

         setList(newList);
      } catch (err) {
         Alert.alert('Error', err);
      }
   }

   async function restoreItem(index: number) {
      try {
         const currentList = await AsyncStorage.getItem('list');

         if (currentList !== null) {
            const parsedList: Item[] = JSON.parse(currentList);

            parsedList.push(list[index]);

            await AsyncStorage.setItem('list', JSON.stringify(parsedList));

            handleUpdateItems();
            handleRemoveItem(index);
         }
      } catch (err) {
         Alert.alert('Error', err);
      }
   }

   function handleRestoreItem(index: number) {
      Alert.alert('Restore item', 'Do you want to restore this item?', [
         {
            text: 'No',
         },
         { text: 'Yes', onPress: () => restoreItem(index) },
      ]);
   }

   return (
      <>
         <StatusBar backgroundColor="#00ff5f" barStyle="dark-content" />
         <SafeAreaView style={styles.root}>
            <ScrollView
               contentInsetAdjustmentBehavior="automatic"
               style={styles.scrollView}>
               <Card
                  style={{
                     container: { paddingTop: 10, paddingBottom: 10 },
                  }}>
                  <View style={styles.container}>
                     <View style={styles.listItem}>
                        {!loading && list.length ? (
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
                                    centerElement={{
                                       primaryText: item.title,
                                       secondaryText: item.description,
                                       tertiaryText: `${MaskService.toMask(
                                          'money',
                                          String(
                                             (Number(
                                                item.money.replace(/\D/g, ''),
                                             ) +
                                                Number(
                                                   item.tax.replace(/\D/g, ''),
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
                                                item.money.replace(/\D/g, ''),
                                             ) +
                                                Number(
                                                   item.tax.replace(/\D/g, ''),
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
                                    onPress={() => handleRestoreItem(index)}
                                    rightElement="delete"
                                    style={{
                                       rightElement: { color: '#fe0000' },
                                    }}
                                    onRightElementPress={() =>
                                       handleRemoveItem(index)
                                    }
                                 />
                              </Card>
                           ))
                        ) : (
                           <Text>There is no trash here.</Text>
                        )}
                     </View>
                  </View>
               </Card>
            </ScrollView>
         </SafeAreaView>
      </>
   );
}
