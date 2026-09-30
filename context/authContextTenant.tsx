import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { supabase } from "../utils/supabase";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Tipizacija tenant profila
interface TenantProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
}

// Tipizacija user-a iz Supabase auth + profil
interface TenantUser {
  id: string;
  email: string;
  profile?: TenantProfile;
}

// Tipizacija konteksta
interface TenantContextType {
  user: TenantUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    ime: string;
    prezime: string;
    telefon: string;
  }) => Promise<void>;
  updateProfile: (data: {
    ime?: string;
    prezime?: string;
    telefon?: string;
  }) => Promise<void>;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<TenantUser | null>(null);

  //
  // 🔹 1. UČITAVANJE SESIJE IZ ASYNC STORAGE
  //
  useEffect(() => {
    const loadStoredSession = async () => {
      try {
        const stored = await AsyncStorage.getItem("tenant_session");

        if (stored) {
          const parsed = JSON.parse(stored);
          setUser(parsed);
        }
      } catch (e) {
        console.log("Greška pri učitavanju sesije:", e);
      }
    };

    loadStoredSession();

    //
    // 🔹 2. SLUŠAČ AUTH PROMENA (Supabase)
    //
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const newUser = {
            id: session.user.id,
            email: session.user.email || "",
          };

          setUser(newUser);
          await AsyncStorage.setItem(
            "tenant_session",
            JSON.stringify(newUser)
          );
        } else {
          setUser(null);
          await AsyncStorage.removeItem("tenant_session");
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  //
  // 🔹 LOGIN
  //
  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // povlačenje profila iz DB
    const { data: tenantData, error: tenantError } = await supabase
      .from("tenants")
      .select("*")
      .eq("id", data.user?.id)
      .single();

    if (tenantError) throw tenantError;

    const userData: TenantUser = {
      id: data.user!.id,
      email: data.user!.email!,
      profile: tenantData,
    };

    setUser(userData);

    // snimanje u Async Storage
    await AsyncStorage.setItem(
      "tenant_session",
      JSON.stringify(userData)
    );
  };

  //
  // 🔹 LOGOUT
  //
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);

    await AsyncStorage.removeItem("tenant_session");

    router.replace("/StartPage");
  };

  //
  // 🔹 REGISTER
  //
  const register = async (data: {
    email: string;
    password: string;
    ime: string;
    prezime: string;
    telefon: string;
  }) => {
    const { data: signUpData, error: authError } =
      await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

    if (authError) throw authError;

    const userId = signUpData.user?.id;
    if (!userId) throw new Error("Korisnik nije kreiran u Auth");

    const { data: tenantRow, error: dbError } = await supabase
      .from("tenants")
      .insert([
        {
          id: userId,
          first_name: data.ime,
          last_name: data.prezime,
          email: data.email,
          phone: data.telefon,
        },
      ])
      .select()
      .single();

    if (dbError) throw dbError;

    const userData: TenantUser = {
      id: userId,
      email: data.email,
      profile: tenantRow,
    };

    setUser(userData);

    await AsyncStorage.setItem(
      "tenant_session",
      JSON.stringify(userData)
    );
  };

  //
  // 🔹 UPDATE PROFILA
  //
  const updateProfile = async (data: {
    ime?: string;
    prezime?: string;
    telefon?: string;
  }) => {
    if (!user?.id) throw new Error("Korisnik nije ulogovan");

    const { data: updatedTenant, error } = await supabase
      .from("tenants")
      .update({
        first_name: data.ime,
        last_name: data.prezime,
        phone: data.telefon,
      })
      .eq("id", user.id)
      .select()
      .single();

    if (error) throw error;

    const updatedUser = { ...user, profile: updatedTenant };
    setUser(updatedUser);

    await AsyncStorage.setItem(
      "tenant_session",
      JSON.stringify(updatedUser)
    );
  };

  return (
    <TenantContext.Provider
      value={{ user, login, logout, register, updateProfile }}
    >
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context)
    throw new Error("useTenant must be used within a TenantProvider");
  return context;
};
