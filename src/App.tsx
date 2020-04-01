import 'react-native-gesture-handler';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import Control from './pages/Control';
import Settings from './pages/Settings';

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
               options={{ gestureDirection: 'vertical-inverted' }}
            />
         </Navigator>
      </NavigationContainer>
   );
}

console.disableYellowBox = true;
