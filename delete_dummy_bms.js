import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rjwhgnssmygrxzkcsnyf.supabase.co';
const supabaseAnonKey = 'sb_publishable_6uSUeyG4bY9YCdpDLilAdA_OOqktJLX';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  console.log('Deleting dummy BMs...');
  await supabase.from('business_managers').delete().in('name', ['BM Anunciante A', 'BM Anunciante B', 'BM Anunciante C']);
  console.log('Deleted dummy BMs.');
}
run();
