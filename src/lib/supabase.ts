import { createClient } from '@supabase/supabase-js'


// Supabase credentials (NEW PROJECT - kocjnpcrufovjwtqpcwg)
const supabaseUrl = 'https://kocjnpcrufovjwtqpcwg.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvY2pucGNydWZvdmp3dHFwY3dnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4ODM4NzQsImV4cCI6MjA3NjQ1OTg3NH0.uhzjXj62WM-fOhg2i1MG16QTBp03caQ95FFfh6sdb-c'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Test function to verify Supabase connection
export const testSupabaseConnection = async () => {
  try {
    // Try to fetch a simple query from the admin_users table
    const { data, error } = await supabase
      .from('admin_users')
      .select('email')
      .limit(1);
    
    if (error) {
      console.error('Supabase connection test failed:', error);
      return false;
    }
    
    console.log('✅ Supabase connection successful!');
    console.log('Admin users found:', data?.length || 0);
    return true;
  } catch (error) {
    console.error('❌ Supabase connection test failed:', error);
    return false;
  }
}
