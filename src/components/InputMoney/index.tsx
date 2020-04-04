import React from 'react';
import { TextInputMask } from 'react-native-masked-text';

import { Props } from './Interfaces';

export default function InputMoney({ value, onChangeText, style }: Props) {
   return (
      <TextInputMask
         type="money"
         options={{
            precision: 2,
            separator: ',',
            delimiter: '.',
            unit: 'R$ ',
         }}
         value={value}
         onChangeText={onChangeText}
         placeholderTextColor="#444"
         style={style}
      />
   );
}
