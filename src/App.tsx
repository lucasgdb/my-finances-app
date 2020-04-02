import 'react-native-gesture-handler';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { YellowBox } from 'react-native';

import Control from './pages/Control';
import Settings from './pages/Settings';
import Trash from './pages/Trash';

const { Navigator, Screen } = createStackNavigator();

export default function App() {
   return (
      <NavigationContainer>
         <Navigator>
            <Screen
               name="Control"
               component={Control}
               options={{
                  headerShown: false,
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
               name="Trash"
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
