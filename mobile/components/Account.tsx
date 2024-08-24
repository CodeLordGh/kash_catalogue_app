import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Account = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account Management</Text>
      {/* Account details and management options */}
      <View style={{backgroundColor: "#151515", marginTop: 20, flex: 1, borderTopEndRadius: 40, borderTopStartRadius: 40, paddingHorizontal: 20, paddingTop: 20}} >
      <Text style={{color: "white"}} >Update Profile</Text>
      <Text style={{color: "white"}} >Manage Settings</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: "#6200EE",
    justifyContent: "center"
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: "#fff",
    textAlign: "center"
  },
});

export default Account;