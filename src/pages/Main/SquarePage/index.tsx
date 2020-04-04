import React from 'react';
import { View, Text } from 'react-native';
import { Divider } from 'react-native-material-ui';

import { Props } from './Interfaces';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function SquarePage({ title, description, onPress }: Props) {
   return (
      <View
         style={{
            marginLeft: '1%',
            marginRight: '1%',
            flexBasis: '90%',
            marginTop: 10,
            borderWidth: 0.5,
            borderColor: '#333',
         }}>
         <TouchableOpacity onPress={onPress}>
            <View
               style={{
                  alignItems: 'center',
                  marginTop: 15,
                  marginBottom: 15,
               }}>
               <Text
                  style={{
                     fontSize: 23,
                     fontFamily: 'Roboto',
                     color: '#333',
                  }}>
                  {title}
               </Text>
            </View>

            <View style={{ alignItems: 'center' }}>
               <Divider style={{ container: { width: '90%' } }} />
            </View>

            <View
               style={{
                  marginLeft: 10,
                  marginRight: 10,
                  marginTop: 20,
                  marginBottom: 20,
               }}>
               <Text
                  style={{
                     fontSize: 14,
                     color: '#333',
                     fontFamily: 'serif',
                  }}>
                  {description}
               </Text>
            </View>

            <Divider />
         </TouchableOpacity>
      </View>
   );
}
