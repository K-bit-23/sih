import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { View } from '../../components/Themed';

export default function EducationScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Education Page</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
