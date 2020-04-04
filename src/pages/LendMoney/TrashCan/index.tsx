import React, { useState, useEffect } from 'react';
import {
   View,
   SafeAreaView,
   StatusBar,
   ScrollView,
   Text,
   Alert,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import { Item } from '../../../shared/Interfaces';
import List from '../../../components/List';

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

   async function RemoveItem(index: number) {
      try {
         const newList = [...list];

         newList.splice(index, 1);

         await AsyncStorage.setItem('trash', JSON.stringify(newList));

         setList(newList);
      } catch (err) {
         Alert.alert('Error', err);
      }
   }

   function handleRemoveItem(index: number) {
      Alert.alert(
         'Remove item',
         'Do you want to remove this item permanently?',
         [
            {
               text: 'No',
            },
            { text: 'Yes', onPress: () => RemoveItem(index) },
         ],
      );
   }

   async function restoreItem(index: number) {
      try {
         const currentList = await AsyncStorage.getItem('list');

         if (currentList !== null) {
            const parseList: Item[] = JSON.parse(currentList);

            const deletedItems = [...list];
            deletedItems[index].missingInstallments =
               deletedItems[index].missingInstallments > 1
                  ? deletedItems[index].missingInstallments
                  : 1;

            parseList.push(deletedItems[index]);

            await AsyncStorage.setItem('list', JSON.stringify(parseList));

            handleUpdateItems();
            RemoveItem(index);
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
         <SafeAreaView style={{ flex: 1 }}>
            <ScrollView
               contentInsetAdjustmentBehavior="automatic"
               style={{ backgroundColor: '#191a21' }}>
               <View
                  style={{
                     marginTop: 7,
                     marginLeft: 20,
                     marginRight: 20,
                  }}>
                  {!loading && list.length ? (
                     list.map((item: Item, index: number) => (
                        <List
                           key={index}
                           item={item}
                           onPress={() => handleRestoreItem(index)}
                           rightElement="delete"
                           style={{
                              container: { backgroundColor: '#282a36' },
                              primaryText: { color: '#fafafb' },
                              secondaryText: { color: '#666' },
                              tertiaryText: { color: '#777' },
                              rightElement: { color: '#fe0000' },
                           }}
                           onRightElementPress={() => handleRemoveItem(index)}
                        />
                     ))
                  ) : (
                     <View
                        style={{
                           backgroundColor: '#282a36',
                           paddingTop: 15,
                           paddingBottom: 15,
                           paddingLeft: 15,
                        }}>
                        <Text style={{ color: '#fafafb' }}>
                           There is no trash here.
                        </Text>
                     </View>
                  )}
               </View>
            </ScrollView>
         </SafeAreaView>
      </>
   );
}
