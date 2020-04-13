import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { Props } from './Interfaces';
import Divider from '../../../components/Divider';
import { Icon } from 'react-native-material-ui';

export default function PageButton({
   title,
   description,
   onPress,
   icon,
}: Props) {
   return (
      <View
         style={{
            marginLeft: '1%',
            marginRight: '1%',
            flexBasis: '90%',
            marginTop: 10,
            borderWidth: 0.7,
            borderColor: '#333',
         }}>
         <TouchableOpacity onPress={onPress ? onPress : () => {}}>
            <View
               style={{
                  alignItems: 'center',
                  marginTop: 15,
                  marginBottom: 15,
               }}>
               {icon && <Icon name={icon} color="#333" />}
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
               <Divider style={{ width: '90%' }} />
            </View>

            <View
               style={{
                  margin: 20,
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
