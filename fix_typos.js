import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rjwhgnssmygrxzkcsnyf.supabase.co';
const supabaseAnonKey = 'sb_publishable_6uSUeyG4bY9YCdpDLilAdA_OOqktJLX';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  console.log('Fixing typos and setting ban reasons...');

  // Fix typo Lecompracion -> Lacompracion
  let { error: err1 } = await supabase.from('ad_accounts')
    .update({ name: 'Lacompracion (1)' })
    .eq('name', 'Lecompracion (1)');
  if (err1) console.error(err1);

  // Fix typo Maxillantas -> Maxitiendas
  let { error: err2 } = await supabase.from('ad_accounts')
    .update({ name: 'Maxitiendas y Yacompro' })
    .ilike('name', '%Maxillantas%');
  if (err2) console.error(err2);
  
  // Fix Mundo-compra -> Mundo compra
  let { error: err3 } = await supabase.from('ad_accounts')
    .update({ name: 'Mundo compra (4)' })
    .eq('name', 'Mundo-compra (4)');
  if (err3) console.error(err3);

  // Set 'Error en el pago' for specifically known ones
  const paymentErrors = [
    'TuStoreOnline (2)', 'Uwashop MX (1)', 'Lacompracion (1)', 'Mundo compra (4)',
    'Ofertas (3)', 'MundoCuentros (2)', 'Azul Claro (1)', 'Mundocompra (1)',
    'Mundocompra (2)', 'TupromoStore (2)', 'Yaencasa (1)'
  ];
  
  for (const name of paymentErrors) {
    await supabase.from('ad_accounts')
      .update({ ban_reason: 'Error en el pago' })
      .ilike('name', name);
  }

  // Set 'Inhabilitada por Políticas' for any other BANNED account that still has no reason
  const { data: bannedAccounts } = await supabase.from('ad_accounts')
    .select('id, ban_reason')
    .eq('status', 'BANNED')
    .is('ban_reason', null);

  if (bannedAccounts) {
    for (const acc of bannedAccounts) {
      await supabase.from('ad_accounts')
        .update({ ban_reason: 'Inhabilitada por Políticas' })
        .eq('id', acc.id);
    }
  }

  console.log('Done!');
}

run();
