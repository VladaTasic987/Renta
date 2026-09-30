import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { useTenant } from '../context/authContextTenant';

export default function TenantLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useTenant();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Unesi email i lozinku");
      return;
    }
    try {
      await login(email, password);
      router.push('/approvals/OwnerList'); // idi na home screen nakon logina
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>{"←"} Nazad</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Login za stanara</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#ccc"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Lozinka"
        placeholderTextColor="#ccc"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Uloguj se</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1e1e1e', justifyContent: 'center', padding: 20 },
  title: { fontSize: 26, marginBottom: 40, textAlign: 'center', fontWeight: 'bold', color: '#f5f5f5' },
  input: { backgroundColor: '#2a2a2a', borderWidth: 1, borderColor: '#444', borderRadius: 10, padding: 14, marginBottom: 20, fontSize: 16, color: '#fff' },
  button: { backgroundColor: '#3a3a3a', padding: 14, borderRadius: 10, borderWidth: 1, borderColor: '#555' },
  buttonText: { color: '#f0f0f0', textAlign: 'center', fontSize: 18, fontWeight: '600' },
  backButton: { position: 'absolute', top: 50, left: 15, padding: 8 },
  backText: { fontSize: 18, color: '#ddd' },
});
