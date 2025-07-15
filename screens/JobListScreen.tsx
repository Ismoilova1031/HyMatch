import { View, Text, StyleSheet } from 'react-native';
export default function JobListScreen() {
  return (
    <View style={styles.container}>
      <Text>Job List Screen</Text>
    </View>
  );
}
const styles = StyleSheet.create({ container: { flex: 1, justifyContent: 'center', alignItems: 'center' } });
