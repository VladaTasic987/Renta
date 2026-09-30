// screens/OwnerRegister.tsx
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { supabase } from '../utils/supabase';
import { useAuth } from '@/context/authContextOwner';

export default function OwnerRegister() {
  const [ime, setIme] = useState('');
  const [prezime, setPrezime] = useState('');
  const [email, setEmail] = useState('');
  const [telefon, setTelefon] = useState('');
  const [grad, setGrad] = useState('');
  const [adresa, setAdresa] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { signIn, loading } = useAuth();

  const handleRegister = async () => {
    if (!ime || !prezime || !email || !password) {
      Alert.alert('Greška', 'Popuni sve obavezne podatke');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Greška', 'Lozinke se ne poklapaju');
      return;
    }

    try {
      // 1️⃣ Signup u Supabase Auth
      const {
        data: signUpData,
        error: signUpError,
      } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;

      const userId = signUpData.user?.id;
      if (!userId) {
        Alert.alert(
          'Greška',
          'Neuspešna registracija. Proveri email verifikaciju.'
        );
        return;
      }

      // 2️⃣ Ubaci u owners tabelu
      const { error: insertError } = await supabase
        .from('owners')
        .insert({
          id: userId,
          first_name: ime,
          last_name: prezime,
          phone: telefon,
          city: grad,
          property_address: adresa,
          email: email,
        });

      if (insertError) throw insertError;

      // 3️⃣ Automatski login (dev mode)
      await signIn(email, password);

      router.push('/(tabs)');
    } catch (err: any) {
      Alert.alert(
        'Greška',
        err.message || 'Došlo je do greške pri registraciji'
      );
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backText}>{'←'} Nazad</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Registracija vlasnika</Text>

      <TextInput
        style={styles.input}
        placeholder="Ime"
        value={ime}
        onChangeText={setIme}
        placeholderTextColor="#ccc"
      />
      <TextInput
        style={styles.input}
        placeholder="Prezime"
        value={prezime}
        onChangeText={setPrezime}
        placeholderTextColor="#ccc"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        placeholderTextColor="#ccc"
      />
      <TextInput
        style={styles.input}
        placeholder="Telefon"
        value={telefon}
        onChangeText={setTelefon}
        keyboardType="phone-pad"
        placeholderTextColor="#ccc"
      />
      <TextInput
        style={styles.input}
        placeholder="Grad"
        value={grad}
        onChangeText={setGrad}
        placeholderTextColor="#ccc"
      />
      <TextInput
        style={styles.input}
        placeholder="Adresa nekretnine"
        value={adresa}
        onChangeText={setAdresa}
        placeholderTextColor="#ccc"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#ccc"
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        placeholderTextColor="#ccc"
      />

      <TouchableOpacity
        style={styles.registerButton}
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={styles.registerText}>
          {loading ? 'Učitavanje...' : 'Registruj se'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1b1b1b',
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 8,
  },
  backText: {
    fontSize: 18,
    color: '#ddd',
  },
  title: {
    fontSize: 26,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#f5f5f5',
    marginBottom: 40,
    marginTop: 90,
  },
  input: {
    backgroundColor: '#2a2a2a',
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: '#fff',
    marginBottom: 18,
  },
  registerButton: {
    backgroundColor: '#3a3a3a',
    paddingVertical: 16,
    borderRadius: 10,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#555',
    alignItems: 'center',
  },
  registerText: {
    color: '#f0f0f0',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
});
