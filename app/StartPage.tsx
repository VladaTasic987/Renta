import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router'; // ili navigation.navigate

import { supabase } from '@/utils/supabase';
import { useEffect } from 'react';




export default function HomeScreen() {

  const [role, setRole] = useState<'owner' | 'tenant' | null>(null);

  const handleRolePress = (selectedRole: 'owner' | 'tenant') => {
    setRole(prev => (prev === selectedRole ? null : selectedRole));
  };

  const handleNavigate = (path: any) => {
  router.push(path);
};

  return (
    <View style={styles.container}>
      {/* Naslov */}
      <Text style={styles.title}>Renta, dobrodošli!</Text>

      {/* Početni tekst */}
      {!role && (
        <Text style={styles.initialText}>
          Odaberite ukoliko ste stanodavac opciju Vlasnik, ili ukoliko ste
          podstanar opciju Stanar.
        </Text>
      )}

      {/* Dugmad Vlasnik / Stanar */}
      <View style={styles.buttonsRow}>
        <TouchableOpacity
          style={styles.roleButton}
          onPress={() => handleRolePress('owner')}
        >
          <Text style={styles.roleButtonText}>Vlasnik</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.roleButton}
          onPress={() => handleRolePress('tenant')}
        >
          <Text style={styles.roleButtonText}>Stanar</Text>
        </TouchableOpacity>
      </View>

      {/* Sekcija koja se pojavljuje ispod dugmadi */}
      {role && (
        <View
          style={[
            styles.infoContainer,
            role === 'owner'
              ? { backgroundColor: '#2a2a2a' } // nijansa za vlasnika
              : { backgroundColor: '#333333' }, // nijansa za stanara
          ]}
        >
          <Text style={styles.infoText}>
            Ako imate nalog, prijavite se; ako nemate, registrujte se.
          </Text>

          {/* Dugmad za vlasnika */}
          {role === 'owner' && (
            <>
              <TouchableOpacity
                style={styles.authButton}
                onPress={() => handleNavigate('/OwnerLogin')}
              >
                <Text style={styles.authButtonText}>Login Vlasnik</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.authButton}
                onPress={() => handleNavigate('/OwnerRegister')}
              >
                <Text style={styles.authButtonText}>Register Vlasnik</Text>
              </TouchableOpacity>
            </>
          )}

          {/* Dugmad za stanara */}
          {role === 'tenant' && (
            <>
              <TouchableOpacity
                style={styles.authButton}
                onPress={() => handleNavigate('/TenantLogin')}
              >
                <Text style={styles.authButtonText}>Login Stanar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.authButton}
                onPress={() => handleNavigate('/TenantRegister')}
              >
                <Text style={styles.authButtonText}>Register Stanar</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    color: '#fff',
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  initialText: {
    color: '#bbb',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 30,
  },
  roleButton: {
    backgroundColor: '#1f1f1f',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  roleButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  infoContainer: {
    marginTop: 20,
    width: '85%',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  infoText: {
    color: '#ddd',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  authButton: {
    backgroundColor: '#2a2a2a',
    paddingVertical: 12,
    paddingHorizontal: 60,
    borderRadius: 14,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#444',
  },
  authButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});
