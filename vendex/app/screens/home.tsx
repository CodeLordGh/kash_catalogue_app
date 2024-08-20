import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface NavBarItemProps {
  icon: string;
  label: string;
  isActive?: boolean;
  onPress: () => void;
}

const NavBarItem: React.FC<NavBarItemProps> = ({ icon, label, isActive, onPress }) => (
  <TouchableOpacity style={styles.navBarItem} onPress={onPress}>
    <Text style={[styles.navBarIcon, isActive && styles.activeIcon]}>{icon}</Text>
    <Text style={[styles.navBarLabel, isActive && styles.activeLabel]}>{label}</Text>
  </TouchableOpacity>
);

interface BottomNavBarProps {
  activeTab: string;
  onTabPress: (tabName: string) => void;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, onTabPress }) => {
  return (
    <View style={styles.navBar}>
      <NavBarItem icon="🏠" label="Home" isActive={activeTab === 'Home'} onPress={() => onTabPress('Home')} />
      <NavBarItem icon="🛒" label="Shop" isActive={activeTab === 'Shop'} onPress={() => onTabPress('Shop')} />
      <NavBarItem icon="🛍️" label="Cart" isActive={activeTab === 'Cart'} onPress={() => onTabPress('Cart')} />
      <NavBarItem icon="❤️" label="Favorites" isActive={activeTab === 'Favorites'} onPress={() => onTabPress('Favorites')} />
      <NavBarItem icon="👤" label="Account" isActive={activeTab === 'Account'} onPress={() => onTabPress('Account')} />
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 10,
  },
  navBarItem: {
    alignItems: 'center',
  },
  navBarIcon: {
    fontSize: 24,
    marginBottom: 2,
  },
  navBarLabel: {
    fontSize: 12,
  },
  activeIcon: {
    color: '#6200ee',
  },
  activeLabel: {
    color: '#6200ee',
  },
});

export default BottomNavBar;