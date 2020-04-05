import { AppRegistry, unstable_enableLogBox, YellowBox } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';

unstable_enableLogBox();

YellowBox.ignoreWarnings([
   'Non-serializable values were found in the navigation state',
   'component',
]);

console.disableYellowBox = true;

AppRegistry.registerComponent(appName, () => App);
