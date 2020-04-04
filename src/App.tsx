import 'react-native-gesture-handler';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { YellowBox, unstable_enableLogBox } from 'react-native';

import Main from './pages/Main';
import LendMoney from './pages/LendMoney';
import Settings from './pages/LendMoney/Settings';
import Trash from './pages/LendMoney/TrashCan';

const { Navigator, Screen } = createStackNavigator();

export default function App() {
   return (
      <NavigationContainer>
         <Navigator>
            <Screen
               name="Main"
               component={Main}
               options={{
                  headerShown: false,
               }}
            />

            <Screen
               name="LendMoney"
               component={LendMoney}
               options={{
                  title: 'Lending Money',
                  headerStyle: { backgroundColor: '#00ff5f' },
                  headerTintColor: '#333',
               }}
            />

            <Screen
               name="Settings"
               component={Settings}
               options={{
                  headerStyle: { backgroundColor: '#00ff5f' },
                  headerTintColor: '#333',
               }}
            />

            <Screen
               name="Trash can"
               component={Trash}
               options={{
                  headerStyle: { backgroundColor: '#00ff5f' },
                  headerTintColor: '#333',
               }}
            />
         </Navigator>
      </NavigationContainer>
   );
}

YellowBox.ignoreWarnings([
   'Non-serializable values were found in the navigation state',
   'component',
]);

console.disableYellowBox = true;

unstable_enableLogBox();
