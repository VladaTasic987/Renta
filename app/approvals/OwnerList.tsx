import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { supabase } from "@/utils/supabase";
import { useTenant } from "@/context/authContextTenant";
import { useRouter } from "expo-router";

interface Owner {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
}

interface Approval {
  id: string;
  tenant_id: string;
  owner_id: string;
  approved: boolean;
}

export default function OwnerList() {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [selectedOwnerId, setSelectedOwnerId] = useState<string | null>(null);
  const { user } = useTenant();
  const router = useRouter();

  useEffect(() => {
    loadOwners();
    loadApprovals();
  }, []);

  useEffect(() => {
    const approved = approvals.some(a => a.approved);
    if (approved) {
      router.push("/(tabs)");
    }
  }, [approvals]);

  const loadOwners = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("owners").select("*");
      if (error) throw error;
      setOwners(data as Owner[]);
    } catch (err) {
      console.log("LOAD OWNERS ERROR:", err);
      setOwners([]);
    } finally {
      setLoading(false);
    }
  };

  const loadApprovals = async () => {
    if (!user?.id) return;
    try {
      const { data, error } = await supabase
        .from("tenant_approvals")
        .select("*")
        .eq("tenant_id", user.id);
      if (error) throw error;
      setApprovals(data as Approval[]);
    } catch (err) {
      console.log("LOAD APPROVALS ERROR:", err);
      setApprovals([]);
    }
  };

  const requestApproval = async (ownerId: string) => {
    if (!user?.id) return;
    try {
      const { data: existing } = await supabase
        .from("tenant_approvals")
        .select("id")
        .eq("tenant_id", user.id)
        .eq("owner_id", ownerId)
        .single();

      if (existing) return;

      await supabase.from("tenant_approvals").insert([
        { tenant_id: user.id, owner_id: ownerId, approved: false },
      ]);

      loadApprovals();
    } catch (err) {
      console.log("REQUEST APPROVAL ERROR:", err);
    }
  };

  const renderItem = ({ item }: { item: Owner }) => {
    const approval = approvals.find(a => a.owner_id === item.id);

    return (
      <View style={styles.ownerItem}>
        <TouchableOpacity onPress={() => setSelectedOwnerId(item.id)}>
          <Text style={styles.ownerName}>
            {item.first_name} {item.last_name}
          </Text>
          {item.email && (
            <Text style={styles.ownerInfo}>Email: {item.email}</Text>
          )}
          {item.phone && (
            <Text style={styles.ownerInfo}>Phone: {item.phone}</Text>
          )}
        </TouchableOpacity>

        {selectedOwnerId === item.id && (
          <>
            {!approval && (
              <TouchableOpacity
                style={styles.button}
                onPress={() => requestApproval(item.id)}
              >
                <Text style={styles.buttonText}>Pošalji zahtev</Text>
              </TouchableOpacity>
            )}

            {approval && !approval.approved && (
              <Text style={{ color: "#fff", marginTop: 10 }}>
                Zahtev poslat, čekate odobrenje vlasnika...
              </Text>
            )}

            {approval && approval.approved && (
              <Text style={{ color: "#0f0", marginTop: 10 }}>
                Zahtev odobren, pristup omogućen.
              </Text>
            )}
          </>
        )}
      </View>
    );
  };

  if (loading)
    return (
      <ActivityIndicator size="large" color="#fff" style={{ flex: 1 }} />
    );

  if (owners.length === 0)
    return (
      <View style={styles.loading}>
        <Text style={styles.text}>Nema registrovanih vlasnika.</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <FlatList
        data={owners}
        renderItem={renderItem}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1b1b1b", padding: 20 },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { color: "#ddd", fontSize: 18 },
  ownerItem: {
    backgroundColor: "#2a2a2a",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#444",
  },
  ownerName: { color: "#fff", fontSize: 18, fontWeight: "600" },
  ownerInfo: { color: "#ccc", fontSize: 14, marginTop: 4 },
  button: {
    backgroundColor: "#0f0",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
