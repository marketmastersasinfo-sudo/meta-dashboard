import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const paulaRojasBMs = [
  {
    name: 'Comprasenunclickmx', type: 'ROOM', status: 'ACTIVE', proxy_country: 'Paula Rojas',
    adAccounts: [{ name: 'Compras en un click (1)', meta_account_id: '190589832408977', status: 'ACTIVE' }]
  },
  {
    name: 'Mundo Compra', type: 'ROOM', status: 'WARNING', proxy_country: 'Paula Rojas',
    adAccounts: [
      { name: 'TuStoreOnline (2)', meta_account_id: '1527495767627237', status: 'BANNED' },
      { name: 'Tienda papaya (1)', meta_account_id: '817087635905079', status: 'ACTIVE' },
      { name: 'Ofertas MX (1)', meta_account_id: '80939575603423', status: 'ACTIVE' },
      { name: 'Uwashop MX (1)', meta_account_id: '1122583844972306', status: 'BANNED' },
      { name: 'MundoCuentros (2)', meta_account_id: '670446740073414', status: 'BANNED' },
      { name: 'Tiendapapaya (1)', meta_account_id: '505563274244576', status: 'BANNED' },
      { name: 'Lecompracion (1)', meta_account_id: '767464174367178', status: 'BANNED' },
      { name: 'Donde los primos (2)', meta_account_id: '797080935411475', status: 'BANNED' },
      { name: 'Azul Claro (1)', meta_account_id: '11524000885703', status: 'BANNED' },
      { name: 'Mundo compra (3)', meta_account_id: '10034335546879', status: 'ACTIVE' },
      { name: 'Mundo-compra (4)', meta_account_id: '676772069096381', status: 'BANNED' },
      { name: 'Mundocompra (1)', meta_account_id: '182846389355540', status: 'BANNED' },
      { name: 'Mundocompra (2)', meta_account_id: '133333333333333', status: 'BANNED' },
      { name: 'Ofertas (3)', meta_account_id: '1523212488503870', status: 'BANNED' }
    ]
  },
  {
    name: 'Techshop', type: 'ROOM', status: 'WARNING', proxy_country: 'Paula Rojas',
    adAccounts: [
      { name: 'Muysica', meta_account_id: '434933776270858', status: 'BANNED' },
      { name: 'Maxillantas y Yacompro', meta_account_id: '1472504737034908', status: 'ACTIVE' },
      { name: 'Compracita', meta_account_id: '810809841435968', status: 'BANNED' },
      { name: 'Internacionales', meta_account_id: '1476303482765004', status: 'ACTIVE' },
      { name: 'Market Master SAS', meta_account_id: '1302742114822014', status: 'ACTIVE' }
    ]
  },
  {
    name: 'TupromoStore.com', type: 'ROOM', status: 'WARNING', proxy_country: 'Paula Rojas',
    adAccounts: [
      { name: 'Uwashop (5)', meta_account_id: '5083834007538237', status: 'BANNED' },
      { name: 'Uwashop (4)', meta_account_id: '8448830424527967', status: 'BANNED' },
      { name: 'Uwashop (3)', meta_account_id: '780781711252196', status: 'BANNED' },
      { name: 'Uwashop (2)', meta_account_id: '373683497904368', status: 'BANNED' },
      { name: 'Uwashop (1)', meta_account_id: '430150223507406', status: 'ACTIVE' },
      { name: 'Tu Promo Store (2.1)', meta_account_id: '702471138848220', status: 'BANNED' }
    ]
  },
  {
    name: 'argenshop.co1', type: 'ROOM', status: 'ACTIVE', proxy_country: 'Paula Rojas',
    adAccounts: [{ name: 'ArgenShop (1)', meta_account_id: '201939302177876', status: 'ACTIVE' }]
  },
  { name: 'chileshop.co', type: 'BACKUP', status: 'ACTIVE', proxy_country: 'Paula Rojas', adAccounts: [] },
  {
    name: 'clickshoes3', type: 'ROOM', status: 'WARNING', proxy_country: 'Paula Rojas',
    adAccounts: [
      { name: 'Paisaton (1)', meta_account_id: '1555561168281560', status: 'BANNED' },
      { name: 'Paisaton (2)', meta_account_id: '1274667953260475', status: 'ACTIVE' },
      { name: 'Tiendapapaya (2)', meta_account_id: '2114886378802783', status: 'BANNED' }
    ]
  },
  { name: 'costaricashop1', type: 'BACKUP', status: 'ACTIVE', proxy_country: 'Paula Rojas', adAccounts: [] },
  {
    name: 'distribuidoroficialpaulavelez', type: 'ROOM', status: 'ACTIVE', proxy_country: 'Paula Rojas',
    adAccounts: [{ name: 'Yaencasa (1)', meta_account_id: '950659345706345', status: 'ACTIVE' }]
  },
  { name: 'espashop.co', type: 'BACKUP', status: 'ACTIVE', proxy_country: 'Paula Rojas', adAccounts: [] },
  {
    name: 'guateshop.co', type: 'ROOM', status: 'ACTIVE', proxy_country: 'Paula Rojas',
    adAccounts: [{ name: 'GuateShop (1)', meta_account_id: '2531315884420002', status: 'ACTIVE' }]
  },
  { name: 'guateshop.co1', type: 'ROOM', status: 'ACTIVE', proxy_country: 'Paula Rojas', adAccounts: [] },
  {
    name: 'mascotilandia.co1', type: 'ROOM', status: 'ACTIVE', proxy_country: 'Paula Rojas',
    adAccounts: [
      { name: 'el efectivo (3)', meta_account_id: '616025096993523', status: 'ACTIVE' },
      { name: 'el efectivo (2)', meta_account_id: '680975873537840', status: 'ACTIVE' },
      { name: 'el efectivo (1)', meta_account_id: '307425644500288', status: 'BANNED' }
    ]
  },
  {
    name: 'monshopco', type: 'ROOM', status: 'ACTIVE', proxy_country: 'Paula Rojas',
    adAccounts: [{ name: 'La compracion (2)', meta_account_id: '369296714763506', status: 'ACTIVE' }]
  },
  {
    name: 'myblustore.com', type: 'ROOM', status: 'ACTIVE', proxy_country: 'Paula Rojas',
    adAccounts: [
      { name: 'Tiendapapaya (1)', meta_account_id: '389014140030410', status: 'ACTIVE' },
      { name: 'Tiendapapaya (2)', meta_account_id: '401131532566282', status: 'ACTIVE' },
      { name: 'Tiendapapaya (3)', meta_account_id: '403165203002741', status: 'ACTIVE' }
    ]
  },
  { name: 'panamashop.co', type: 'BACKUP', status: 'ACTIVE', proxy_country: 'Paula Rojas', adAccounts: [] },
  { name: 'paraguashop1', type: 'BACKUP', status: 'ACTIVE', proxy_country: 'Paula Rojas', adAccounts: [] },
  { name: 'perushop.co', type: 'BACKUP', status: 'ACTIVE', proxy_country: 'Paula Rojas', adAccounts: [] },
  { name: 'vene.shop1', type: 'BACKUP', status: 'ACTIVE', proxy_country: 'Paula Rojas', adAccounts: [] },
  { name: 'vistet1', type: 'BACKUP', status: 'ACTIVE', proxy_country: 'Paula Rojas', adAccounts: [] }
];

async function seedData() {
  console.log('Starting seed process for Paula Rojas profile...');
  
  // First, optionally clear existing dummy data that isn't Paula Rojas
  // Wait, let's just insert these as new ones so we don't accidentally delete anything they added manually.
  
  for (const bm of paulaRojasBMs) {
    const { adAccounts, ...bmData } = bm;
    
    // Insert BM
    const { data: bmInserted, error: bmError } = await supabase
      .from('business_managers')
      .insert([bmData])
      .select()
      .single();
      
    if (bmError) {
      console.error('Error inserting BM:', bmData.name, bmError);
      continue;
    }
    
    console.log(`Inserted BM: ${bmData.name} (${bmInserted.id})`);
    
    // Insert Ad Accounts if any
    if (adAccounts && adAccounts.length > 0) {
      const accountsToInsert = adAccounts.map(cp => ({
        bm_id: bmInserted.id,
        name: cp.name,
        meta_account_id: cp.meta_account_id,
        status: cp.status,
        total_spend: 0 // Mock total spend since we don't have exact figures from images
      }));
      
      const { error: cpError } = await supabase
        .from('ad_accounts')
        .insert(accountsToInsert);
        
      if (cpError) {
        console.error(`Error inserting CPs for BM ${bmData.name}:`, cpError);
      } else {
        console.log(`  -> Inserted ${accountsToInsert.length} Ad Accounts for ${bmData.name}`);
      }
    }
  }
  
  console.log('Seed process completed successfully!');
}

seedData();
