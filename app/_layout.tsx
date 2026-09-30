import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { AuthProvider } from '@/context/authContextOwner';
import { TenantProvider } from '@/context/authContextTenant';
import { TenantApprovalsProvider } from '@/context/tenantApprovalsContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  //
  // 🔹 Provera za vlasnika + stanara
  //
  useEffect(() => {
    const checkAllSessions = async () => {
      const tenant = await AsyncStorage.getItem("tenant_session");
      const owner = await AsyncStorage.getItem("owner_session");

      if (tenant || owner) {
        setInitialRoute("(tabs)");
      } else {
        setInitialRoute("StartPage");
      }
    };

    checkAllSessions();
  }, []);

  if (initialRoute === null) return null; // loading

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <TenantProvider>
          <TenantApprovalsProvider>
            <Stack initialRouteName={initialRoute}>
              <Stack.Screen name="StartPage" options={{ headerShown: false }} />
              <Stack.Screen name="OwnerLogin" options={{ headerShown: false }} />
              <Stack.Screen name="TenantLogin" options={{ headerShown: false }} />
              <Stack.Screen name="OwnerRegister" options={{ headerShown: false }} />
              <Stack.Screen name="TenantRegister" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>

            <StatusBar style="auto" />
          </TenantApprovalsProvider>
        </TenantProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
