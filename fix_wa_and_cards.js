import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rjwhgnssmygrxzkcsnyf.supabase.co';
const supabaseAnonKey = 'sb_publishable_6uSUeyG4bY9YCdpDLilAdA_OOqktJLX';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const waDataToInsert = {
  'Comprasenunclickmx': ['Test WhatsApp Business Account'],
  'Techshop': ['Test WhatsApp Business Account', 'uwashop.co', 'TuPromoStore', 'Uwashop Col'],
  'TuPromoStore.com': ['Test WhatsApp Business Account', 'uwashop.co', 'TuPromoStore', 'Uwashop Col'],
  'clickshoes3': ['Test WhatsApp Business Account', 'Yaencasa Col'],
  'myblustore': ['Test WhatsApp Business Account', 'Yaencasa Col'],
  'vistet1': ['Vistet'],
  'Mundo Compra': ['Test WhatsApp Business Account', 'Lacompracion', 'DLP', 'Mundo Compra', 'Donde los Primos Col']
};

const cardsToUpdate = {
  'Tienda papaya (1)': { mask: null, balance: 0 },
  'Ofertasz (5)': { mask: '3310', balance: 0 },
  'Uwashop(4)': { mask: '6070', balance: 0 },
  'MundoCuentros (2)': { mask: '0721', balance: 151237 },
  'Tiendapapaya (1)': { mask: null, balance: 1030854 },
  'Lacompracion (1)': { mask: '2627', balance: 1972540 },
  'Dondelosprimos (1)': { mask: null, balance: 0 },
  'Azul Claro (1)': { mask: '0410', balance: 143374 },
  'Mundo compra (3)': { mask: null, balance: 0 },
  'Mundo compra (4)': { mask: '0721', balance: 163110 },
  'Mundocompra (1)': { mask: '0721', balance: 1656588 },
  'Mundocompra (2)': { mask: '0721', balance: 2500685 },
  'Ofertasz (3)': { mask: null, balance: 0 },
  'Yaencasa (2)': { mask: null, balance: 0 },
  'TupromoStore (2)': { mask: '0721', balance: 151345 },
  'Donde los primos (5)': { mask: null, balance: 0 },
  'Yaencasa (1)': { mask: '6260', balance: 445919 }
};

async function fixWaAndCards() {
  console.log('Fixing WhatsApps...');
  const { data: bms } = await supabase.from('business_managers').select('id, name');
  
  for (const bm of bms) {
    const was = waDataToInsert[bm.name];
    if (was) {
      for (const wa of was) {
        // use 'phone' instead of 'phone_number'
        const { error } = await supabase.from('whatsapp_lines').insert({ bm_id: bm.id, name: wa, phone: 'N/A', status: 'ACTIVE' });
        if (error) console.error(`Error WA ${wa}:`, error.message);
        else console.log(`Inserted WA ${wa} for ${bm.name}`);
      }
    }
  }

  console.log('\nFixing Cards for Mundo Compra Ad Accounts...');
  const { data: adAccounts } = await supabase.from('ad_accounts').select('id, name');
  for (const acc of adAccounts) {
    // try exact match
    let updateData = cardsToUpdate[acc.name];
    if (!updateData) {
      // try case insensitive match
      const key = Object.keys(cardsToUpdate).find(k => k.toLowerCase() === acc.name.toLowerCase());
      if (key) updateData = cardsToUpdate[key];
    }
    
    if (updateData) {
      const { error } = await supabase.from('ad_accounts')
        .update({ card_mask: updateData.mask, current_balance: updateData.balance })
        .eq('id', acc.id);
      if (error) console.error(`Error Card ${acc.name}:`, error.message);
      else console.log(`Updated Card for ${acc.name} to Mask: ${updateData.mask}, Balance: ${updateData.balance}`);
    }
  }

  console.log('\n✅ Fix Complete!');
}

fixWaAndCards();
