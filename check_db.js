import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function check() {
  const { data, error } = await supabase.from('business_managers').select('*');
  console.log('Error:', error);
  console.log('BMs count:', data ? data.length : 0);
  if (data && data.length > 0) {
      console.log('First BM:', data[0]);
  }
}

check();
