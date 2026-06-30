import React from 'react';
import { ShieldCheck, ShieldAlert, Package, Skull, ArrowRight, Smartphone, Box, Shield, Plus, Share2, Server, Network } from 'lucide-react';

const FederatedVaultNode = ({ profile, title, color, isTemplate, bms = [], ads = [], was = [], pxs = [] }) => {
  // Extract data for actual profiles
  let vault = null;
  let warriors = [];
  let reserves = [];
  let cemetery = [];
  let profileWAs = [];
  let profilePxs = [];

  if (!isTemplate && profile !== 'GABRIELA TEGUCHI') {
    // Para simplificar la visualización, simulamos qué BM será la Bóveda reciclada
    if (profile === 'PAULA ROJAS') {
      vault = { name: 'BÓVEDA-PAULA (BM distribuidorof)' };
      profileWAs = was.filter(w => w.profile === 'Paula Rojas');
      profilePxs = pxs.filter(p => ['Pixel Releasit Yaencasa (1)', 'Pixel Funnelish CEC', 'Pixel Paisaton Funnelish', 'Pixel Funnelish El efectivo', 'Pixel Funnelish Tiendapapaya', 'Pixel de myblustore.com', 'Pixel Releasit Tiendapapaya (1)'].includes(p.name));
    } else if (profile === 'LUZ ANGELA') {
      vault = { name: 'BÓVEDA-LUZ (BM comprasenunclickco)' };
      profileWAs = was.filter(w => w.profile === 'Luz Angela');
      profilePxs = pxs.filter(p => ['Pixel Releasit Tiendapapaya', 'Pixel Releasit Uwashop', 'Pixel Yacompro Releasit', 'Pixel Shopygangas', 'Pixel efectivo', 'Pixel Yaencasa Releasit', 'Pixel funnelish TP FBN', 'Pixel Lacompración Funnelish', 'Pixel GuateShop'].includes(p.name));
    } else if (profile === 'NELSON LOPEZ') {
      vault = { name: 'BÓVEDA-NELSON (BM Nuevo)' };
      profilePxs = pxs.filter(p => ['Pixel ComprasYa FB More Login', 'Pixel Market Master General Contingencia 1'].includes(p.name));
      // Asumimos que conectará un número de Chatify después
    }

    // Get active BMs for pauta (Guerreros)
    const profileBMs = bms.filter(b => b.facebook_profile?.toUpperCase() === profile);
    profileBMs.forEach(bm => {
      const bmAds = ads.filter(a => a.bm_id === bm.id);
      const activeAds = bmAds.filter(a => a.status === 'ACTIVE');
      const debt = bmAds.reduce((sum, a) => sum + (a.current_balance || 0), 0);
      
      if (debt > 1000000 || (bmAds.length > 0 && bmAds.every(a => a.status !== 'ACTIVE'))) {
        cemetery.push(bm);
      } else if (activeAds.length > 0) {
        warriors.push(bm);
      } else {
        reserves.push(bm);
      }
    });
  } else if (profile === 'GABRIELA TEGUCHI') {
    const profileBMs = bms.filter(b => b.facebook_profile?.toUpperCase() === 'GABRIELA TEGUCHI');
    warriors = profileBMs; // Gabriela solo pauta, no bóveda
  }

  return (
    <div style={{ 
      background: 'var(--bg-primary)', 
      borderRadius: '16px', 
      border: `2px solid ${color}40`,
      overflow: 'hidden',
      boxShadow: `0 8px 24px ${color}15`,
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ background: `linear-gradient(90deg, ${color}20, ${color}05)`, padding: '16px 20px', borderBottom: `1px solid ${color}30` }}>
        <h3 style={{ margin: 0, color: color, display: 'flex', alignItems: 'center', gap: '10px', fontSize: '18px', fontWeight: '800' }}>
          {isTemplate ? <Plus size={20} /> : <Server size={20} />}
          {title}
        </h3>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          {isTemplate ? 'Modelo a seguir para cada nuevo perfil antidetect.' : 'Entorno aislado en MoreLogin'}
        </div>
      </div>

      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', flexGrow: 1 }}>
        
        {/* BOVEDA SECTION */}
        {profile !== 'GABRIELA TEGUCHI' && (
          <div style={{ background: 'var(--bg-secondary)', border: `2px dashed ${color}`, borderRadius: '12px', padding: '20px', position: 'relative' }}>
            <div style={{ fontWeight: '800', color: color, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={20} /> {isTemplate ? 'BÓVEDA-[NUEVO PERFIL]' : vault?.name}
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ background: 'var(--bg-primary)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #25d366' }}>
                <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#25d366', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                  <Smartphone size={14}/> Integración Chatify
                </div>
                {isTemplate ? (
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Nuevo número de WA</div>
                ) : profileWAs.length > 0 ? (
                  profileWAs.slice(0, 3).map(w => <div key={w.id} style={{ fontSize: '11px', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>• {w.name || w.phone}</div>)
                ) : (
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Sin WAs asignados</div>
                )}
                {profileWAs.length > 3 && <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '4px' }}>+{profileWAs.length - 3} más</div>}
              </div>

              <div style={{ background: 'var(--bg-primary)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #f59e0b' }}>
                <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                  <Box size={14}/> Integración Shopyeasy
                </div>
                {isTemplate ? (
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Nuevo Pixel FB</div>
                ) : profilePxs.length > 0 ? (
                  profilePxs.slice(0, 3).map(p => <div key={p.name} style={{ fontSize: '11px', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>• {p.name}</div>)
                ) : (
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Sin Píxeles</div>
                )}
                {profilePxs.length > 3 && <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '4px' }}>+{profilePxs.length - 3} más</div>}
              </div>
            </div>

            {/* Sharing Arrow */}
            <div style={{ position: 'absolute', bottom: '-26px', left: '50%', transform: 'translateX(-50%)', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '30px', height: '30px', background: 'var(--bg-primary)', borderRadius: '50%', border: `1px solid ${color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: color }}>
                <Share2 size={16} />
              </div>
            </div>
          </div>
        )}

        {/* GUERREROS SECTION */}
        <div style={{ background: 'var(--bg-secondary)', border: `1px solid ${profile === 'GABRIELA TEGUCHI' ? color : 'rgba(6,182,212,0.3)'}`, borderRadius: '12px', padding: '20px', marginTop: profile === 'GABRIELA TEGUCHI' ? '0' : '10px' }}>
          <div style={{ fontWeight: '800', color: profile === 'GABRIELA TEGUCHI' ? color : '#06b6d4', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={20} /> GUERREROS (Pauta Activa)
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {isTemplate ? (
              <>
                <div style={{ background: 'var(--bg-primary)', padding: '10px', borderRadius: '6px', fontSize: '12px', color: 'var(--text-primary)', borderLeft: '3px solid #06b6d4' }}>⚔️ BM Guerrero 1 (Recibe Pixel)</div>
                <div style={{ background: 'var(--bg-primary)', padding: '10px', borderRadius: '6px', fontSize: '12px', color: 'var(--text-primary)', borderLeft: '3px solid #06b6d4' }}>⚔️ BM Guerrero 2 (Recibe Pixel)</div>
              </>
            ) : warriors.length > 0 ? (
              warriors.map(bm => (
                <div key={bm.id} style={{ background: 'var(--bg-primary)', padding: '10px', borderRadius: '6px', fontSize: '12px', color: 'var(--text-primary)', borderLeft: '3px solid #06b6d4' }}>
                  ⚔️ {bm.name}
                </div>
              ))
            ) : (
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Sin guerreros activos.</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

const IdealArchitecture = ({ bms, ads, was, pxs }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ 
        background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(168, 85, 247, 0.02) 100%)', 
        border: '1px solid rgba(168, 85, 247, 0.3)', 
        borderLeft: '4px solid #a855f7',
        padding: '24px', 
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
      }}>
        <h3 style={{ color: '#a855f7', marginTop: 0, display: 'flex', alignItems: 'center', gap: '10px', fontSize: '20px', letterSpacing: '-0.5px' }}>
          <Network size={24} /> Arquitectura de Bóvedas Descentralizadas
        </h3>
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.6' }}>
          Este mapa visualiza el estado de escalabilidad infinita. Cada perfil antidetect opera como su propio <strong>ecosistema blindado</strong>. La Bóveda (arriba) ancla y protege las integraciones vitales (Chatify/Shopyeasy) y le inyecta la data a los Guerreros (abajo) para pautar de forma segura sin exponer los activos.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        
        {/* NODO PAULA */}
        <FederatedVaultNode 
          profile="PAULA ROJAS" 
          title="PERFIL 1: PAULA ROJAS" 
          color="#a855f7" 
          bms={bms} ads={ads} was={was} pxs={pxs} 
        />

        {/* NODO LUZ ANGELA */}
        <FederatedVaultNode 
          profile="LUZ ANGELA" 
          title="PERFIL 2: LUZ ANGELA" 
          color="#10b981" 
          bms={bms} ads={ads} was={was} pxs={pxs} 
        />

        {/* NODO NELSON */}
        <FederatedVaultNode 
          profile="NELSON LOPEZ" 
          title="PERFIL 3: NELSON LOPEZ" 
          color="#3b82f6" 
          bms={bms} ads={ads} was={was} pxs={pxs} 
        />

        {/* NODO GABRIELA */}
        <FederatedVaultNode 
          profile="GABRIELA TEGUCHI" 
          title="PERFIL 4: GABRIELA TEGUCHI (Alquilada)" 
          color="#f43f5e" 
          bms={bms} ads={ads} was={was} pxs={pxs} 
        />

        {/* NODO TEMPLATE (ESCALABILIDAD) */}
        <FederatedVaultNode 
          profile="NUEVO" 
          title="NUEVO PERFIL (ESCALABILIDAD)" 
          color="#f59e0b" 
          isTemplate={true} 
        />

      </div>
    </div>
  );
};

export default IdealArchitecture;
