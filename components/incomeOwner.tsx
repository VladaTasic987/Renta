import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StatusBar, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface Income {
  id: string;
  amount: string;
  month: string;
  year: string;
  date: Date;
}

export default function TenantIncomeScreen() {
  const [amount, setAmount] = useState('');

  const months = [
    'Januar', 'Februar', 'Mart', 'April', 'Maj', 'Jun',
    'Jul', 'Avgust', 'Septembar', 'Oktobar', 'Novembar', 'Decembar'
  ];

  const years = ['2024', '2025', '2026', '2027', '2028'];

  const [selectedMonth, setSelectedMonth] = useState(months[new Date().getMonth()]);
  const [selectedYear, setSelectedYear] = useState(String(new Date().getFullYear()));

  const [incomes, setIncomes] = useState<Income[]>([]);

  const addIncome = () => {
    if (!amount) return;

    setIncomes(prev => [
      {
        id: Date.now().toString(),
        amount,
        month: selectedMonth,
        year: selectedYear,
        date: new Date(),
      },
      ...prev,
    ]);

    setAmount('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kirija</Text>

      <TextInput
        style={styles.input}
        placeholder="Iznos (RSD)"
        placeholderTextColor="#bbb"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />

      {/* MJESEC */}
      <Text style={styles.label}>Mesec</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={selectedMonth}
          onValueChange={setSelectedMonth}
          dropdownIconColor="#fff"
          style={styles.picker}
        >
          {months.map(m => (
            <Picker.Item key={m} label={m} value={m} />
          ))}
        </Picker>
      </View>

      {/* GODINA */}
      <Text style={styles.label}>Godina</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={selectedYear}
          onValueChange={setSelectedYear}
          dropdownIconColor="#fff"
          style={styles.picker}
        >
          {years.map(y => (
            <Picker.Item key={y} label={y} value={y} />
          ))}
        </Picker>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={addIncome}>
        <Text style={styles.addButtonText}>Dodaj kiriju</Text>
      </TouchableOpacity>

      <FlatList
        style={{ marginTop: 10 }}
        data={incomes}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>Nema unetih kirija</Text>}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>
              {item.amount} RSD
            </Text>

            <Text style={styles.itemDate}>
              {item.month} {item.year}
            </Text>
          </View>
        )}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2e2e2e',
    paddingTop: StatusBar.currentHeight || 20,
    padding: 20,
  },
  title: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    color: '#ccc',
    marginBottom: 4,
    marginTop: 8,
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
  pickerWrapper: {
    backgroundColor: '#444',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#555',
    marginBottom: 12,
  },
  picker: {
    color: '#fff',
    height: 50,
  },
  addButton: {
    backgroundColor: '#6a9c78',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
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
    fontSize: 16,
    color: '#fff',
  },
  itemDate: {
    color: '#bbb',
    marginTop: 4,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
  },
});
