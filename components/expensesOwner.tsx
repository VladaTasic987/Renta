import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface Expense {
  id: string;
  description: string;
  amount: string;
  date: Date;
}

export default function ExpensesScreen() {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const addExpense = () => {
    if (!description || !amount) return;

    const newExpense: Expense = {
      id: Date.now().toString(),
      description,
      amount,
      date,
    };

    setExpenses(prev => [newExpense, ...prev]);
    setDescription('');
    setAmount('');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Text style={styles.title}>Ekran troškova</Text>

      <TextInput
        style={styles.input}
        placeholder="Opis troška"
        placeholderTextColor="#bbb"
        value={description}
        onChangeText={setDescription}
      />

      <TextInput
        style={styles.input}
        placeholder="Iznos"
        placeholderTextColor="#bbb"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />

      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.dateText}>
          Datum: {date.toLocaleDateString()}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          onChange={(_, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      <TouchableOpacity style={styles.addButton} onPress={addExpense}>
        <Text style={styles.addButtonText}>Dodaj trošak</Text>
      </TouchableOpacity>

      <FlatList
        data={expenses}
        style={{ marginTop: 10 }}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>Nema troškova</Text>}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>
              {item.description} - {item.amount} RSD
            </Text>
            <Text style={styles.itemDate}>{item.date.toLocaleDateString()}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: StatusBar.currentHeight || 20,
    backgroundColor: '#2e2e2e',
  },
  title: {
    fontSize: 22,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#444',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#555',
    marginBottom: 12,
    color: '#fff',
  },
  dateButton: {
    backgroundColor: '#555',
    padding: 12,
    borderRadius: 8,
  },
  dateText: {
    color: '#fff',
  },
  addButton: {
    backgroundColor: '#6a9c78',
    padding: 14,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  item: {
    backgroundColor: '#3c3c3c',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  itemText: {
    color: '#fff',
    fontSize: 16,
  },
  itemDate: {
    color: '#bbb',
    marginTop: 5,
  },
  emptyText: {
    color: '#aaa',
    textAlign: 'center',
    marginTop: 20,
  },
});
