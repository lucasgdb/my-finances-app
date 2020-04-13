import React from 'react';
import { View, StatusBar, SafeAreaView, ScrollView } from 'react-native';
import { Toolbar } from 'react-native-material-ui';

import PageButton from './PageButton';

// @ts-ignore
export default function Main({ navigation }) {
   return (
      <>
         <StatusBar backgroundColor="#191a21" barStyle="light-content" />
         <SafeAreaView style={{ flex: 1 }}>
            <Toolbar
               leftElement="menu"
               centerElement="My Finances"
               style={{
                  container: { backgroundColor: '#00ff5f' },
                  titleText: { color: '#333' },
                  leftElement: { color: '#333' },
               }}
            />

            <ScrollView
               contentInsetAdjustmentBehavior="automatic"
               style={{
                  backgroundColor: '#00ff5f',
                  flex: 1,
               }}>
               <View
                  style={{
                     flex: 1,
                     flexDirection: 'row',
                     flexWrap: 'wrap',
                     justifyContent: 'center',
                  }}>
                  <PageButton
                     title="Lend money"
                     description={`"Control your finances by lending money to people and getting a percentage back."`}
                     onPress={() => navigation.navigate('LendMoney')}
                     icon="attach-money"
                  />

                  <PageButton
                     title="Coming soon"
                     description="More features are coming soon."
                  />
               </View>
            </ScrollView>
         </SafeAreaView>
      </>
   );
}
