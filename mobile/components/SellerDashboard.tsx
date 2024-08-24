import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

const SellerDashboard = () => {
  return (
    <View style={styles.container}>
      <View style={{alignItems: "center"}} >
      <Text style={styles.title}>Recent Orders</Text>
      </View>
      {/* Sample Order Item */}
      <View style={styles.orderContainer} >
      <ScrollView>
      <View style={styles.orderItem}>
        <Text style={styles.text} >Order ID: 12345</Text>
        <Text style={styles.text} >Date: 2024-08-20</Text>
        <Text style={styles.text} >Status: Shipped</Text>
        <Text style={styles.text} >Products: Item A, Item B</Text>
      </View>
      </ScrollView>
      </View>
      {/* Add more order items as needed */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: "#6200EE"
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: "white"
  },
  orderContainer: {
    marginTop: 20,
    backgroundColor: '#151515',
    flex:1,
    borderTopEndRadius: 40,
    borderTopStartRadius: 40,
    paddingHorizontal: 10,
    paddingTop:10
  },
  orderItem: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#343434',
    borderRadius: 5,
  },
  text: {
    color: "white"
  }
});

export default SellerDashboard;