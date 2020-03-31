import React from 'react';
import {
   SafeAreaView,
   StyleSheet,
   ScrollView,
   StatusBar,
} from 'react-native';

import { Subheader } from 'react-native-material-ui';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const App = () => {
   return (
      <>
         <StatusBar barStyle="dark-content" />
         <SafeAreaView>
            <ScrollView
               contentInsetAdjustmentBehavior="automatic"
               style={styles.scrollView}>
               <Subheader text="My Finances" />
            </ScrollView>
         </SafeAreaView>
      </>
   );
};

const styles = StyleSheet.create({
   scrollView: {
      backgroundColor: Colors.lighter,
   },
});

export default App;
