import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';

import HomePage from '@/components/homePage';
import TenantIncomeScreen from '@/components/incomeOwner';
import ExpensesScreen from '@/components/expensesOwner';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [view, setView] = useState<'home' | 'income' | 'expenses'>('home');

  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setDrawerVisible(true)}>
          <Ionicons name="menu" size={28} color={Colors[colorScheme ?? 'light'].tint} />
        </TouchableOpacity>

        <Text style={[styles.headerText, { color: Colors[colorScheme ?? 'light'].tint }]}>
          Home
        </Text>
      </View>

      {/* CONTENT */}
      <View style={styles.content}>
        {view === 'home' && <HomePage />}
        {view === 'income' && <TenantIncomeScreen />}
        {view === 'expenses' && <ExpensesScreen />}
      </View>

      {/* DRAWER */}
      <Modal visible={drawerVisible} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.overlay}
            onPress={() => setDrawerVisible(false)}
          />

          <View style={styles.drawer}>
            <ScrollView>

              <TouchableOpacity
                style={styles.drawerButton}
                onPress={() => {
                  setView('income');
                  setDrawerVisible(false);
                }}>
                <Text style={styles.drawerText}>Income</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.drawerButton}
                onPress={() => {
                  setView('expenses');
                  setDrawerVisible(false);
                }}>
                <Text style={styles.drawerText}>Expenses</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.drawerButton}
                onPress={() => {
                  setView('home');
                  setDrawerVisible(false);
                }}>
                <Text style={styles.drawerText}>Home</Text>
              </TouchableOpacity>

            </ScrollView>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#484646ff',
    backgroundColor: '#484646ff',
  },
  headerText: {
    fontSize: 20,
    marginLeft: 20,
  },
  content: {
    flex: 1,
  },

  /* Drawer fix */
  modalContainer: {
    position: 'absolute',
    top: 0, bottom: 0, left: 0, right: 0,
    flexDirection: 'row',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  drawer: {
    width: 240,
    backgroundColor: '#222',
    paddingTop: 70,
  },
  drawerButton: {
    padding: 18,
  },
  drawerText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
});
