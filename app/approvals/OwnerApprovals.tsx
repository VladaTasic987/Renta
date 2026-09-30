import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { supabase } from "@/utils/supabase";
import { useAuth } from "@/context/authContextOwner";

interface Approval {
  id: string;
  tenant_id: string;
  owner_id: string;
  approved: boolean;
  first_name?: string;
  last_name?: string;
  email?: string;
}

export default function OwnerApprovals() {
  const { user } = useAuth();
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);

  const loadApprovals = async () => {
    if (!user?.id) return;
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("tenant_approvals")
        .select(`
          id,
          tenant_id,
          owner_id,
          approved,
          first_name,
          last_name
        `)
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const mapped = (data as any).map((a: any) => ({
        ...a,
        first_name: a.first_name ?? "",
        last_name: a.last_name ?? "",
        email: a.email ?? "",
      }));

      setApprovals(mapped);
    } catch (err) {
      console.log("LOAD APPROVALS ERROR:", err);
      setApprovals([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (id: string, approve: boolean) => {
    try {
      const { error } = await supabase
        .from("tenant_approvals")
        .update({ approved: approve })
        .eq("id", id);

      if (error) throw error;

      loadApprovals();
    } catch (err) {
      console.log("UPDATE APPROVAL ERROR:", err);
    }
  };

  useEffect(() => {
    loadApprovals();
  }, []);

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#fff" style={{ flex: 1 }} />
    );
  }

  if (approvals.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={{ color: "#fff", fontSize: 18 }}>Nema zahteva.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={approvals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.text}>
              Tenant: {item.first_name} {item.last_name}
            </Text>
            <Text style={styles.text}>Email: {item.email}</Text>
            <Text style={styles.text}>
              Approved: {item.approved ? "DA" : "NE"}
            </Text>

            <View style={styles.buttonsContainer}>
              {!item.approved ? (
                <>
                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: "#0f0" }]}
                    onPress={() => handleApproval(item.id, true)}
                  >
                    <Text style={styles.buttonText}>DA</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: "#f00" }]}
                    onPress={() => handleApproval(item.id, false)}
                  >
                    <Text style={styles.buttonText}>NE</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: "#ff9900" }]}
                  onPress={() => handleApproval(item.id, false)}
                >
                  <Text style={styles.buttonText}>Poništi odobrenje</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1b1b1b", padding: 20 },
  item: {
    backgroundColor: "#2a2a2a",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#444",
  },
  text: {
    color: "#fff",
    fontSize: 16,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: "center",
  },
  buttonText: { color: "#000", fontWeight: "bold", fontSize: 16 },
});
