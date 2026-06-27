import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rjwhgnssmygrxzkcsnyf.supabase.co';
const supabaseAnonKey = 'sb_publishable_6uSUeyG4bY9YCdpDLilAdA_OOqktJLX';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const dataToInsert = {
  'Mundo Compra': {
    pages: ['La Compracion', 'Lcompracioncom', 'Lacompracion', 'Dondelosprimos1', 'Efectivo.com', 'El efectivo', 'Mundo Compra Ofertas y Descuentos', 'Distribuidor Oficial Paula Velez', 'Ofertasz.mx', 'myblustore.com', 'Tiendapapaya', 'Yaencasa', 'Azul Claro', 'Uwashop', 'Dondelosprimosmx', 'Dondelosprimos', 'mundo-compra.com', 'Mundo Compra'],
    instagrams: ['distribuidoroficialpaulavelez', 'mundo.compra', 'tiendapapaya1', 'dondelosprimos1', 'el.efectivo.co'],
    whatsapps: ['Test WhatsApp Business Account', 'Lacompracion', 'DLP', 'Mundo Compra', 'Donde los Primos Col'],
    pixels: ['Pixel Releash Yaencasa (1)', 'Pixel Mundocompra FN (1)', 'Pixel de Mundo-compra.com AD AC', 'Pixel Funnelish Lacompracion', 'Pixel de TuStoreonline Funnelish', 'Pixel Azul Claro', 'Pixel DLP Funnelish', 'Pixel Funnelish Tiendapapaya']
  },
  'argenshop.co1': {
    pages: ['Argenshop'],
    instagrams: ['argenshop.co1']
  }
};

async function seedDetails2() {
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
  
  console.log('\n✅ Seeding details 2 complete!');
}

seedDetails2();
