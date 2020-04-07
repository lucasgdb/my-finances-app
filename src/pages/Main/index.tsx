import React from 'react';
import { View, StatusBar, SafeAreaView, ScrollView } from 'react-native';

import SquarePage from './SquarePage';
import { Toolbar } from 'react-native-material-ui';

// @ts-ignore
export default function Main({ navigation }) {
   return (
      <>
         <StatusBar backgroundColor="#191a21" barStyle="light-content" />
         <SafeAreaView style={{ flex: 1 }}>
            <ScrollView
               contentInsetAdjustmentBehavior="automatic"
               style={{
                  backgroundColor: '#00ff5f',
                  flex: 1,
               }}>
               <Toolbar
                  leftElement="menu"
                  centerElement="My Finances"
                  style={{
                     container: { backgroundColor: '#00ff5f' },
                     titleText: { color: '#333' },
                     leftElement: { color: '#333' },
                  }}
               />

               <View
                  style={{
                     flex: 1,
                     flexDirection: 'row',
                     flexWrap: 'wrap',
                     justifyContent: 'center',
                  }}>
                  <SquarePage
                     title="Lend money"
                     description="Control your finances by lending money to people and getting a percentage back."
                     onPress={() => navigation.navigate('LendMoney')}
                     icon="attach-money"
                  />

                  <SquarePage
                     title="Coming soon"
                     description="More features are coming soon."
                  />
               </View>
            </ScrollView>
         </SafeAreaView>
      </>
   );
}
