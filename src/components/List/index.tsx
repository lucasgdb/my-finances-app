import React from 'react';
import { ListItem, Card } from 'react-native-material-ui';
import { MaskService } from 'react-native-masked-text';

import { Props } from './Interfaces';
import { MONEY_CONFIG } from '../../constants';
import SumMoney from '../../helpers/SumMoney';
import ParseMoney from '../../helpers/ParseMoney';

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
               primaryText: `${item.title} (${
                  item.installments - item.missingInstallments
               }/${item.installments})`,
               secondaryText: item.description,
               tertiaryText: `To pay: ${MaskService.toMask(
                  'money',
                  String(
                     item.perMonth[
                        item.installments - item.missingInstallments
                     ],
                  ),
                  MONEY_CONFIG,
               )} (${MaskService.toMask(
                  'money',
                  String(
                     SumMoney(
                        item.perMonth.slice(
                           0,
                           item.installments - item.missingInstallments,
                        ),
                     ),
                  ),
                  MONEY_CONFIG,
               )} / ${MaskService.toMask(
                  'money',
                  String(ParseMoney(item.money) + ParseMoney(item.tax)),
                  MONEY_CONFIG,
               )})`,
            }}
            onPress={onPress}
            rightElement={rightElement}
            onRightElementPress={onRightElementPress}
            style={style}
         />
      </Card>
   );
}
