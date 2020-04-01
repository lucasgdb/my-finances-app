import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
   root: {
      flex: 1,
   },
   scrollView: {
      backgroundColor: 'rgb(245, 245, 245)',
   },
   container: {
      paddingLeft: 20,
      paddingRight: 20,
      flex: 1,
      marginTop: 10,
   },
   currentMoney: {
      fontSize: 19,
   },
   typeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
   },
   inputMask: {
      flexGrow: 1,
   },
   listItem: {
      marginTop: 15,
   },
   negativeMargin: {
      marginTop: -5,
      marginBottom: -5,
   },
});

export default styles;
