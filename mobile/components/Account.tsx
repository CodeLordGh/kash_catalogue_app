import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Account = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account Management</Text>
      {/* Account details and management options */}
      <Text>Update Profile</Text>
      <Text>Manage Settings</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default Account;