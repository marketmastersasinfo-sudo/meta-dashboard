import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rjwhgnssmygrxzkcsnyf.supabase.co';
const supabaseAnonKey = 'sb_publishable_6uSUeyG4bY9YCdpDLilAdA_OOqktJLX';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const dataToInsert = {
  'Comprasenunclickmx': {
    pages: ['Compras en un click', 'Compras en un click MX'],
    instagrams: ['comprasenunclickmx'],
    pixels: ['Pixel Funnelish CEC'],
    whatsapps: ['Test WhatsApp Business Account']
  },
  'Techshop': {
    pages: ['Techshop'],
    instagrams: [],
    pixels: [],
    whatsapps: ['Test WhatsApp Business Account', 'uwashop.co', 'TuPromoStore', 'Uwashop Col']
  },
  'TuPromoStore.com': {
    pages: ['Lacompracion1', 'Ya en Casa', 'Drakkars.co', 'Tu Promo Store', 'Tiendapapaya', 'Azul Claro', 'Uwashop', 'Dondelosprimosmx', 'mundo-compra.com'],
    instagrams: ['tupromostore_com', 'tiendapapaya1', 'mundo.compra'],
    pixels: ['Pixel retarget Tiendapapaya (1)', 'Pixel Drakkars Funnelish', 'Multi Pixel Releash COD', 'Pixel de Flow Shop', 'Pixel Releash Yaencasa (1)', 'Pixel Uwashop FBM (3)', 'Pixel donde los primos (1)'],
    whatsapps: ['Test WhatsApp Business Account', 'uwashop.co', 'TuPromoStore', 'Uwashop Col']
  },
  'chileshop.co': {
    pages: ['Chileshop']
  },
  'clickshoes3': {
    pages: ['Drakkars', 'TuStoreOnline', 'Ofertazo', 'Palsalon', 'Yaencasa', 'Azul Claro', 'Dondelosprimosmx'],
    instagrams: ['palsalon.co1', 'tuxtore.co', 'drakkars.co1'],
    whatsapps: ['Test WhatsApp Business Account', 'Yaencasa Col'],
    pixels: ['Pixel Palsalon Funnelish']
  },
  'distribuidoroficialpaulavelez': {
    pages: ['La Compracion', 'Ofertazo.mx'],
    instagrams: ['distribuidoroficialpaulavelez']
  },
  'guateshop.co1': {
    pages: ['GuateShop'],
    instagrams: ['guateshop.co1']
  },
  'mascotilandia.co1': {
    pages: ['Mascotilandia'],
    instagrams: ['efectivo.co', 'mascotilandia.co'],
    pixels: ['Pixel Funnelish El efectivo']
  },
  'monshopco': {
    pages: ['Monshop'],
    instagrams: ['monshopco']
  },
  'myblustore': {
    pages: ['myblustore.com', 'Tiendapapaya', 'Ofertazo.mx', 'Yaencasa', 'Azul Claro'],
    instagrams: ['myblustore'],
    whatsapps: ['Test WhatsApp Business Account', 'Yaencasa Col'],
    pixels: ['Pixel Funnelish Tiendapapaya']
  },
  'panamashop.co': {
    pages: ['Panamashop'],
    instagrams: ['panamashop.co']
  },
  'paraguashop1': {
    pages: ['Paraguashop'],
    instagrams: ['paraguashop1']
  },
  'perushop.co': {
    pages: ['Perushop'],
    instagrams: ['perushop.co']
  },
  'vene.shop1': {
    pages: ['Veneshop'],
    instagrams: ['vene.shop1']
  },
  'vistet1': {
    pages: ['Vistet?'],
    instagrams: ['vistet1'],
    whatsapps: ['Vistet']
  }
};

async function seedDetails() {
  console.log('Fetching existing BMs...');
  const { data: bms, error: bmError } = await supabase.from('business_managers').select('id, name');
  if (bmError) {
    console.error('Error fetching BMs:', bmError);
    return;
  }

  for (const bm of bms) {
    const details = dataToInsert[bm.name];
    if (!details) continue;

    console.log(`\nSeeding details for BM: ${bm.name}`);

    // Pages
    if (details.pages) {
      for (const page of details.pages) {
        await supabase.from('pages').insert({ bm_id: bm.id, name: page, status: 'ACTIVE' });
        console.log(`  - Page: ${page}`);
      }
    }

    // Instagrams
    if (details.instagrams) {
      for (const ig of details.instagrams) {
        await supabase.from('instagram_accounts').insert({ bm_id: bm.id, handle: ig, status: 'ACTIVE' });
        console.log(`  - IG: @${ig}`);
      }
    }

    // Pixels
    if (details.pixels) {
      for (const px of details.pixels) {
        await supabase.from('pixels').insert({ bm_id: bm.id, name: px, status: 'ACTIVE' });
        console.log(`  - Pixel: ${px}`);
      }
    }

    // WhatsApps
    if (details.whatsapps) {
      for (const wa of details.whatsapps) {
        await supabase.from('whatsapp_lines').insert({ bm_id: bm.id, name: wa, phone_number: 'N/A', status: 'ACTIVE' });
        console.log(`  - WhatsApp: ${wa}`);
      }
    }
  }
  
  console.log('\n✅ Seeding details complete!');
}

seedDetails();
