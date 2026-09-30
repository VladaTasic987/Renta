// screens/OwnerLogin.tsx
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { useAuth } from '@/context/authContextOwner';

export default function OwnerLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, loading } = useAuth(); // koristimo AuthContext

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Unesi email i lozinku");
      return;
    }

    try {
      await signIn(email, password);
      router.push('/(tabs)');
    } catch (err: any) {
      alert(err.message || "Došlo je do greške pri logovanju");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>{"←"} Nazad</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Login za vlasnika</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#ccc"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Lozinka"
        placeholderTextColor="#ccc"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Uloguj se</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1e1e1e', justifyContent: 'center', padding: 20 },
  title: { fontSize: 26, marginBottom: 40, textAlign: 'center', fontWeight: 'bold', color: '#f5f5f5' },
  input: { backgroundColor: '#2a2a2a', borderWidth: 1, borderColor: '#444', borderRadius: 10, padding: 14, marginBottom: 20, fontSize: 16, color: '#fff' },
  button: { backgroundColor: '#3a3a3a', padding: 14, borderRadius: 10, borderWidth: 1, borderColor: '#555', alignItems: 'center' },
  buttonText: { color: '#f0f0f0', textAlign: 'center', fontSize: 18, fontWeight: '600' },
  backButton: { position: 'absolute', top: 50, left: 15, padding: 8 },
  backText: { fontSize: 18, color: '#ddd' }
});
