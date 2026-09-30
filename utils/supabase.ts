import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://lpzvqascbpnvgfnvusij.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwenZxYXNjYnBudmdmbnZ1c2lqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyMDI5NDIsImV4cCI6MjA4MDc3ODk0Mn0.rJtEUTQTUU9DL46dULzPrqzdN4lsCG2YtRZLlWuJBJU';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON, {
  auth: {
    storage: AsyncStorage,
    persistSession: true,      // čuva sesiju
    autoRefreshToken: true,    // automatski refresh
  },
});