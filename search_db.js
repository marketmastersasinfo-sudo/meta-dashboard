import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rjwhgnssmygrxzkcsnyf.supabase.co';
const supabaseAnonKey = 'sb_publishable_6uSUeyG4bY9YCdpDLilAdA_OOqktJLX';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  const { data: adAccounts } = await supabase.from('ad_accounts').select('*').ilike('name', '%Maxi%');
  console.log('Ad Accounts:', adAccounts);
  
  const { data: bms } = await supabase.from('business_managers').select('*').ilike('name', '%Maxi%');
  console.log('BMs:', bms);
  
  const { data: whatsapps } = await supabase.from('whatsapp_lines').select('*').ilike('name', '%Maxi%');
  console.log('Whatsapps:', whatsapps);
}
run();
