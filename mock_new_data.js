import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rjwhgnssmygrxzkcsnyf.supabase.co';
const supabaseAnonKey = 'sb_publishable_6uSUeyG4bY9YCdpDLilAdA_OOqktJLX';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  console.log('Running quick updates for new UI features...');
  
  // 1. Update ban_reason on ad accounts
  const { data: adAccounts } = await supabase.from('ad_accounts').select('id, name');
  if (adAccounts) {
    for (const cp of adAccounts) {
      if (['MundoCuentros (2)', 'Lacompracion (1)', 'Azul Claro (1)', 'Mundo compra (4)', 'Mundocompra (1)', 'Mundocompra (2)', 'TupromoStore (2)', 'Yaencasa (1)'].includes(cp.name)) {
        await supabase.from('ad_accounts').update({ ban_reason: 'Error en el pago' }).eq('id', cp.id);
      }
    }
    console.log('Updated ban reasons.');
  }

  // 2. Update WhatsApp cards
  const { data: wa } = await supabase.from('whatsapp_lines').select('id, name');
  if (wa) {
    for (const w of wa) {
      if (w.name === 'Test WhatsApp Business Account') {
        await supabase.from('whatsapp_lines').update({ card_mask: '5265' }).eq('id', w.id);
      } else if (w.name === 'Uwashop Col') {
        await supabase.from('whatsapp_lines').update({ card_mask: '0066' }).eq('id', w.id);
      } else if (w.name === 'Yaencasa Col') {
        await supabase.from('whatsapp_lines').update({ card_mask: '5450' }).eq('id', w.id);
      }
    }
    console.log('Updated WhatsApp cards.');
  }
}
run();
