import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import BottomNavBar from './home';
import ItemSelectionFragment from './itemsSelection';

const MainScreen = () => {
  const [activeTab, setActiveTab] = useState('Shop');

  const handleTabPress = (tabName: string) => {
    setActiveTab(tabName);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Shop':
        return <ItemSelectionFragment />;
      case 'Home':
      case 'Cart':
      case 'Favorites':
      case 'Account':
        // Placeholder for other tabs
        return <View style={styles.placeholderContent}></View>;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {renderContent()}
      </View>
      <BottomNavBar activeTab={activeTab} onTabPress={handleTabPress} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  placeholderContent: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
});

export default MainScreen;