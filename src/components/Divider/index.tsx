import React from 'react';
import { Divider as MUIDivider } from 'react-native-material-ui';

import { Props } from './Interfaces';

export default function Divider({ style, light }: Props) {
   return (
      <MUIDivider
         style={{
            container: light ? { ...style, backgroundColor: '#444' } : style,
         }}
      />
   );
}
