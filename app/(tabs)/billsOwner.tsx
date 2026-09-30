import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface Bill {
  id: string;
  type: string;
  amount: string;
  month: string;
  year: string;
}

export default function BillsScreen() {
  const [selectedBill, setSelectedBill] = useState<string>('Elektrodistribucija');
  const [amount, setAmount] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('Januar');
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [bills, setBills] = useState<Bill[]>([]);

  const addBill = () => {
    if (!amount) return;

    const newBill: Bill = {
      id: Date.now().toString(),
      type: selectedBill,
      amount,
      month: selectedMonth,
      year: selectedYear,
    };

    setBills(prev => [newBill, ...prev]);
    setAmount('');
  };

  const months = [
    'Januar', 'Februar', 'Mart', 'April', 'Maj', 'Jun',
    'Jul', 'Avgust', 'Septembar', 'Oktobar', 'Novembar', 'Decembar'
  ];

  const years = Array.from({ length: 10 }, (_, i) => (new Date().getFullYear() - i).toString());

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Praćenje računa</Text>

      {/* Tip računa */}
      <Picker
        selectedValue={selectedBill}
        onValueChange={itemValue => setSelectedBill(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Elektrodistribucija" value="Elektrodistribucija" />
        <Picker.Item label="Vodovod" value="Vodovod" />
        <Picker.Item label="Objedinjena naplata" value="Objedinjena naplata" />
        <Picker.Item label="Komunalac" value="Komunalac" />
        <Picker.Item label="PWW" value="PWW" />
      </Picker>

      {/* Mesec */}
      <Picker
        selectedValue={selectedMonth}
        onValueChange={itemValue => setSelectedMonth(itemValue)}
        style={styles.picker}
      >
        {months.map(month => (
          <Picker.Item key={month} label={month} value={month} />
        ))}
      </Picker>

      {/* Godina */}
      <Picker
        selectedValue={selectedYear}
        onValueChange={itemValue => setSelectedYear(itemValue)}
        style={styles.picker}
      >
        {years.map(year => (
          <Picker.Item key={year} label={year} value={year} />
        ))}
      </Picker>

      {/* Iznos */}
      <TextInput
        style={styles.input}
        placeholder="Unesite iznos"
        placeholderTextColor="#ccc"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      {/* Dugme OK */}
      <TouchableOpacity style={styles.button} onPress={addBill}>
        <Text style={styles.buttonText}>OK</Text>
      </TouchableOpacity>

      {/* Lista računa */}
      <FlatList
        style={styles.list}
        data={bills}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.billItem}>
            <Text style={styles.billText}>
              {item.type} - {item.amount} RSD
            </Text>
            <Text style={styles.billDate}>
              {item.month} {item.year}
            </Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Nema unetih računa</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#2e2e2e',
    marginTop: 50,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
    textAlign: 'center',
  },
  picker: {
    backgroundColor: '#444',
    color: '#fff',
    marginBottom: 10,
    borderRadius: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#444',
    color: '#fff',
  },
  button: {
    backgroundColor: '#6a9c78',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
  },
  billItem: {
    padding: 15,
    backgroundColor: '#3c3c3c',
    borderRadius: 8,
    marginBottom: 10,
  },
  billText: {
    color: '#fff',
    fontSize: 16,
  },
  billDate: {
    color: '#ccc',
    fontSize: 12,
    marginTop: 5,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
  },
});
