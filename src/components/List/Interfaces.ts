import { Item } from '../../shared/Interfaces';

export interface Props {
   item: Item;
   onPress: () => void;
   rightElement: string;
   onRightElementPress: () => void;
   style?: object;
}
