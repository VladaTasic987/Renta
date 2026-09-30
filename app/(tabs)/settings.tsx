import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import { useAuth } from "@/context/authContextOwner";
import OwnerApprovals from "../approvals/OwnerApprovals";
import { useTenant } from "@/context/authContextTenant";

interface UserProfile {
  first_name: string;
  last_name: string;
}

export default function Settings() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { user: tenantUser, logout: tenantSignOut } = useTenant(); // Ispravno dekonstruisano
  const [ownerProfile, setOwnerProfile] = useState<UserProfile | null>(null);
  const [tenantProfile, setTenantProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadOwner = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("owners")
        .select("first_name, last_name")
        .eq("id", user.id)
        .single();

      if (!error && data) setOwnerProfile(data);
    } catch (err) {
      console.log("LOAD OWNER ERROR:", err);
    }
  };

  const loadTenant = async () => {
    if (!tenantUser) {
      setTenantProfile(null);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("tenants")
        .select("first_name, last_name")
        .eq("id", tenantUser.id)
        .single();

      if (!error && data) setTenantProfile(data);
    } catch (err) {
      console.log("LOAD TENANT ERROR:", err);
      setTenantProfile(null);
    }
  };

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await loadOwner();
      await loadTenant();
      setLoading(false);
    };
    loadAll();
  }, [user, tenantUser]);

  if (authLoading || loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Vlasnik */}
      {ownerProfile ? (
        <>
          <Text style={styles.title}>Profil vlasnika</Text>
          <Text style={styles.text}>Ime: {ownerProfile.first_name}</Text>
          <Text style={styles.text}>Prezime: {ownerProfile.last_name}</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
            <Text style={styles.logoutText}>Logout vlasnik</Text>
          </TouchableOpacity>
          <OwnerApprovals />
        </>
      ) : (
        <Text style={styles.text}>Nema ulogovanog vlasnika.</Text>
      )}

      {/* Stanar */}
      {tenantProfile ? (
        <>
          <Text style={styles.title}>Profil stanara</Text>
          <Text style={styles.text}>Ime: {tenantProfile.first_name}</Text>
          <Text style={styles.text}>Prezime: {tenantProfile.last_name}</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={tenantSignOut}>
            <Text style={styles.logoutText}>Logout stanar</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.text}>Nema ulogovanog stanara.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1b1b1b",
    padding: 20,
    alignItems: "center",
    marginTop: 50,
  },
  title: { fontSize: 24, color: "#fff", fontWeight: "bold", marginBottom: 20 },
  text: { fontSize: 18, color: "#ddd", marginBottom: 10 },
  logoutButton: {
    marginTop: 15,
    backgroundColor: "#3a3a3a",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#555",
  },
  logoutText: { color: "#f0f0f0", fontSize: 18, fontWeight: "600" },
});
