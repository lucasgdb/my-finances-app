import React from 'react';
import { ListItem, Card } from 'react-native-material-ui';
import { MaskService } from 'react-native-masked-text';

import { Props } from './Interfaces';
import ParseMoney from '../../helpers/ParseMoney';
import { MONEY_CONFIG } from '../../constants';

export default function List({
   item,
   onPress,
   rightElement,
   onRightElementPress,
   style,
}: Props) {
   return (
      <Card
         style={{
            container: {
               marginLeft: 0,
               marginRight: 0,
               borderRadius: 0,
            },
         }}>
         <ListItem
            centerElement={{
               primaryText: item.title,
               secondaryText: item.description,
               tertiaryText: `${MaskService.toMask(
                  'money',
                  String(
                     (ParseMoney(item.money) + ParseMoney(item.tax)) /
                        item.installments,
                  ),
                  MONEY_CONFIG,
               )} * ${item.missingInstallments} = ${MaskService.toMask(
                  'money',
                  String(
                     ((ParseMoney(item.money) + ParseMoney(item.tax)) /
                        item.installments) *
                        item.missingInstallments,
                  ),
                  MONEY_CONFIG,
               )}`,
            }}
            onPress={onPress}
            rightElement={rightElement}
            onRightElementPress={onRightElementPress}
            style={style}
         />
      </Card>
   );
}
