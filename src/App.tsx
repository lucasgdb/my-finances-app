import React from 'react';
import {
   SafeAreaView,
   StyleSheet,
   ScrollView,
   StatusBar,
   TextInput,
   View,
} from 'react-native';

import { Toolbar, ListItem } from 'react-native-material-ui';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const App = () => {
   return (
      <>
         <StatusBar barStyle="light-content" />
         <SafeAreaView style={styles.root}>
            <ScrollView
               contentInsetAdjustmentBehavior="automatic"
               style={styles.scrollView}>
               <Toolbar leftElement="menu" centerElement="My Finances" />

               <View style={styles.container}>
                  <TextInput style={styles.txtMoney} />

                  <ListItem
                     centerElement={{
                        primaryText: 'Primary text',
                        secondaryText: 'teest',
                        tertiaryText: 'hello.',
                     }}
                     onPress={() => {}}
                     divider
                  />
               </View>
            </ScrollView>
         </SafeAreaView>
      </>
   );
};

const styles = StyleSheet.create({
   root: {
      flex: 1,
   },
   scrollView: {
      backgroundColor: Colors.lighter,
   },
   container: {
      paddingLeft: 20,
      paddingRight: 20,
      flex: 1,
   },
   txtMoney: {
      backgroundColor: Colors.lighter,
   },
});

export default App;
