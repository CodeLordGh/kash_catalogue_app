import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Messages = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Messages</Text>
      {/* Sample message item */}
      <View style={styles.messageItem}>
        <Text>App Message: Your order has been shipped!</Text>
      </View>
      {/* Add more message items as needed */}
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
  messageItem: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#e0f7fa',
    borderRadius: 5,
  },
});

export default Messages;