import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rjwhgnssmygrxzkcsnyf.supabase.co';
const supabaseAnonKey = 'sb_publishable_6uSUeyG4bY9YCdpDLilAdA_OOqktJLX';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  const { data, error } = await supabase.from('whatsapp_lines').select('*');
  console.log('Error:', error);
  console.log('WhatsApps count:', data ? data.length : 0);
  if (data && data.length > 0) {
      console.log('First WA:', data[0]);
  }
}

check();
