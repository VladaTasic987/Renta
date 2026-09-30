import { ScrollView, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { useTenant } from '../context/authContextTenant';

export default function TenantRegister() {
  const [ime, setIme] = useState('');
  const [prezime, setPrezime] = useState('');
  const [email, setEmail] = useState('');
  const [telefon, setTelefon] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const { register } = useTenant();

  const handleRegister = async () => {
    if (!ime || !prezime || !email || !telefon || !password || !confirm) {
      alert('Popuni sva polja');
      return;
    }
    if (password !== confirm) {
      alert('Lozinke se ne poklapaju');
      return;
    }
    try {
      await register({ ime, prezime, email, telefon, password });
      router.push('/approvals/OwnerList');
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>{"←"} Nazad</Text>
      </TouchableOpacity>

      <TextInput style={styles.input} placeholder='Ime' placeholderTextColor="#ccc" value={ime} onChangeText={setIme} />
      <TextInput style={styles.input} placeholder='Prezime' placeholderTextColor="#ccc" value={prezime} onChangeText={setPrezime} />
      <TextInput style={styles.input} placeholder='Email' placeholderTextColor="#ccc" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder='Telefon' placeholderTextColor="#ccc" value={telefon} onChangeText={setTelefon} />
      <TextInput style={styles.input} placeholder='Password' placeholderTextColor="#ccc" secureTextEntry value={password} onChangeText={setPassword} />
      <TextInput style={styles.input} placeholder='Confirm Password' placeholderTextColor="#ccc" secureTextEntry value={confirm} onChangeText={setConfirm} />

      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerText}>Registruj se</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1b1b1b' },
  content: { paddingHorizontal: 20, paddingTop: 70, paddingBottom: 40 },
  backButton: { marginBottom: 30, paddingVertical: 8 },
  backText: { fontSize: 20, color: '#e0e0e0' },
  input: { backgroundColor: '#2a2a2a', borderWidth: 1, borderColor: '#444', borderRadius: 10, padding: 14, fontSize: 16, color: '#fff', marginBottom: 18 },
  registerButton: { backgroundColor: '#3a3a3a', paddingVertical: 16, borderRadius: 10, marginTop: 10, borderWidth: 1, borderColor: '#555' },
  registerText: { color: '#f0f0f0', textAlign: 'center', fontSize: 18, fontWeight: '600' },
});
