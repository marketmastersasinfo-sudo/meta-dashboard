import React from 'react';
import { ShieldCheck, ShieldAlert, Package, Skull, ArrowRight, Smartphone, Box } from 'lucide-react';

const IdealArchitecture = ({ bms, ads, was, pxs }) => {
  const profiles = ['Paula Rojas', 'Luz Angela', 'Gabriela Teguchi', 'Nelson Lopez'];

  // Función para clasificar los BMs actuales según la lógica ideal
  const classifyBM = (bm) => {
    const bmAds = ads.filter(a => a.bm_id === bm.id);
    const activeAds = bmAds.filter(a => a.status === 'ACTIVE');
    const bannedAds = bmAds.filter(a => a.status !== 'ACTIVE');
    const debt = bmAds.reduce((sum, a) => sum + (a.current_balance || 0), 0);

    // Cementerio
    if (debt > 1000000 || (bannedAds.length > activeAds.length && bmAds.length > 0)) {
      return 'CEMENTERIO';
    }
    // Guerreros (tienen cuentas activas y deuda manejable)
    if (activeAds.length > 0) {
      return 'GUERRERO';
    }
    // Reservas (limpios, sin cuentas)
    if (bmAds.length === 0) {
      return 'RESERVA';
    }
    // Por defecto a cementerio si están baneados pero no superan activos
    if (bannedAds.length > 0 && activeAds.length === 0) {
        return 'CEMENTERIO';
    }
    return 'RESERVA';
  };

  const getProfileAssets = (profileName) => {
    const profileBMs = bms.filter(b => b.facebook_profile === profileName);
    const guerreros = profileBMs.filter(b => classifyBM(b) === 'GUERRERO');
    const reservas = profileBMs.filter(b => classifyBM(b) === 'RESERVA');
    const cementerios = profileBMs.filter(b => classifyBM(b) === 'CEMENTERIO');
    
    // Todos los WAs y Pixeles de este perfil (sin importar en qué BM estén ahora)
    const profileBMIds = profileBMs.map(b => b.id);
    const profileWAs = was.filter(w => profileBMIds.includes(w.bm_id));
    const profilePxs = pxs.filter(p => profileBMIds.includes(p.bm_id));

    return { guerreros, reservas, cementerios, profileWAs, profilePxs };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ 
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.02) 100%)', 
        border: '1px solid rgba(16, 185, 129, 0.3)', 
        borderLeft: '4px solid var(--success)',
        padding: '24px', 
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
      }}>
        <h3 style={{ color: 'var(--success)', marginTop: 0, display: 'flex', alignItems: 'center', gap: '10px', fontSize: '20px', letterSpacing: '-0.5px' }}>
          <ShieldCheck size={24} /> Arquitectura de Contingencia Ideal (Modelo A + C)
        </h3>
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.6' }}>
          Este diagrama muestra el flujo <strong>seguro</strong> para tus activos. Las <strong>Bóvedas</strong> (creadas en MoreLogin) almacenan Píxeles y WhatsApps y NUNCA pautan. 
          Los <strong>Guerreros</strong> reciben los activos por invitación y asumen el riesgo publicitario. El <strong>Cementerio</strong> se aísla por completo.
        </p>
      </div>

      {profiles.map(profile => {
        const { guerreros, reservas, cementerios, profileWAs, profilePxs } = getProfileAssets(profile);
        
        if (guerreros.length === 0 && reservas.length === 0 && cementerios.length === 0) return null;

        return (
          <div key={profile} style={{ 
            background: 'var(--bg-primary)', 
            padding: '30px', 
            borderRadius: '16px', 
            border: '1px solid var(--border-color)', 
            boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
            overflowX: 'auto' 
          }}>
            <h2 style={{ 
              display: 'flex', alignItems: 'center', gap: '12px', 
              borderBottom: '2px solid var(--bg-secondary)', 
              paddingBottom: '16px', marginBottom: '30px', 
              color: 'var(--text-primary)', fontSize: '22px', fontWeight: '800', letterSpacing: '-0.5px' 
            }}>
              <span style={{ background: 'var(--bg-secondary)', padding: '8px 12px', borderRadius: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Perfil MoreLogin</span>
              {profile.toUpperCase()}
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1.2fr) 60px minmax(280px, 1fr) minmax(240px, 1fr) minmax(240px, 1fr)', gap: '16px', alignItems: 'stretch' }}>
              
              {/* COL 1: BOVEDAS */}
              <div style={{ 
                borderRadius: '12px', 
                background: 'var(--bg-secondary)', 
                border: '1px solid rgba(168,85,247,0.2)',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(168,85,247,0.05)'
              }}>
                <div style={{ background: 'linear-gradient(90deg, rgba(168,85,247,0.15) 0%, rgba(168,85,247,0.05) 100%)', padding: '16px 20px', borderBottom: '1px solid rgba(168,85,247,0.1)' }}>
                  <div style={{ fontWeight: '800', color: '#a855f7', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px' }}>
                    <ShieldCheck size={20} /> 1. BÓVEDA
                  </div>
                </div>
                <div style={{ padding: '20px' }}>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.6', background: 'rgba(168,85,247,0.05)', padding: '10px', borderRadius: '8px' }}>
                    <strong>Acción:</strong> Crea un BM 100% nuevo. NUNCA agregues tarjetas ni anuncios. Mueve estos activos hacia allí:
                  </div>
                  
                  {profileWAs.length > 0 && (
                    <div style={{ marginBottom: '20px' }}>
                      <strong style={{ color: 'var(--text-primary)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                        <Smartphone size={16} color="#25d366"/> Mover WhatsApps:
                      </strong>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {profileWAs.map(w => <div key={w.id} style={{ fontSize: '13px', padding: '8px 12px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{width:'6px', height:'6px', borderRadius:'50%', background:'#25d366'}}></span> {w.name || w.phone}</div>)}
                      </div>
                    </div>
                  )}
                  {profilePxs.length > 0 && (
                    <div>
                      <strong style={{ color: 'var(--text-primary)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                        <Box size={16} color="#f59e0b"/> Mover Píxeles:
                      </strong>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {profilePxs.map(p => <div key={p.id} style={{ fontSize: '13px', padding: '8px 12px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{width:'6px', height:'6px', borderRadius:'50%', background:'#f59e0b'}}></span> {p.name}</div>)}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* FLECHAS */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#a855f7', opacity: 0.8 }}>
                <div style={{ width: '2px', flexGrow: 1, background: 'linear-gradient(to bottom, transparent, rgba(168,85,247,0.2) 20%, rgba(168,85,247,0.2) 80%, transparent)' }}></div>
                <div style={{ padding: '20px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                  <ArrowRight size={28} strokeWidth={2.5} />
                  <span style={{ fontSize: '10px', writingMode: 'vertical-rl', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase' }}>Compartir Socio</span>
                </div>
                <div style={{ width: '2px', flexGrow: 1, background: 'linear-gradient(to bottom, transparent, rgba(168,85,247,0.2) 20%, rgba(168,85,247,0.2) 80%, transparent)' }}></div>
              </div>

              {/* COL 2: GUERREROS */}
              <div style={{ 
                borderRadius: '12px', 
                background: 'var(--bg-secondary)', 
                border: '1px solid rgba(6,182,212,0.2)',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(6,182,212,0.05)'
              }}>
                <div style={{ background: 'linear-gradient(90deg, rgba(6,182,212,0.15) 0%, rgba(6,182,212,0.05) 100%)', padding: '16px 20px', borderBottom: '1px solid rgba(6,182,212,0.1)' }}>
                  <div style={{ fontWeight: '800', color: '#06b6d4', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px' }}>
                    <ShieldAlert size={20} /> 2. GUERREROS
                  </div>
                </div>
                <div style={{ padding: '20px' }}>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.6' }}>
                    Son los únicos que pautan. Reciben el pixel de la bóveda. Máximo 2 cuentas por tarjeta.
                  </div>
                  {guerreros.length === 0 ? <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontStyle: 'italic' }}>Ningún guerrero activo.</div> : null}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {guerreros.map(bm => (
                      <div key={bm.id} style={{ background: 'var(--bg-primary)', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #06b6d4', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                        <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-primary)' }}>{bm.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>Activo pautando</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* COL 3: RESERVAS */}
              <div style={{ 
                borderRadius: '12px', 
                background: 'var(--bg-secondary)', 
                border: '1px solid rgba(59,130,246,0.2)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{ background: 'linear-gradient(90deg, rgba(59,130,246,0.15) 0%, rgba(59,130,246,0.05) 100%)', padding: '16px 20px', borderBottom: '1px solid rgba(59,130,246,0.1)' }}>
                  <div style={{ fontWeight: '800', color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px' }}>
                    <Package size={20} /> 3. RESERVAS
                  </div>
                </div>
                <div style={{ padding: '20px' }}>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.6' }}>
                    BMs limpios congelados. Enciéndelos solo cuando un Guerrero caiga.
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {reservas.slice(0, 7).map(bm => (
                      <div key={bm.id} style={{ background: 'var(--bg-primary)', padding: '12px', borderRadius: '6px', fontSize: '13px', border: '1px solid var(--border-color)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: '#3b82f6' }}>📦</span> {bm.name}
                      </div>
                    ))}
                    {reservas.length > 7 && <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 'bold', marginTop: '8px', textAlign: 'center', background: 'rgba(59,130,246,0.05)', padding: '6px', borderRadius: '4px' }}>+ {reservas.length - 7} más en banca</div>}
                  </div>
                </div>
              </div>

              {/* COL 4: CEMENTERIO */}
              <div style={{ 
                borderRadius: '12px', 
                background: 'var(--bg-secondary)', 
                border: '1px solid rgba(239,68,68,0.3)',
                position: 'relative',
                overflow: 'hidden',
                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(239,68,68,0.03) 10px, rgba(239,68,68,0.03) 20px)'
              }}>
                <div style={{ background: 'linear-gradient(90deg, rgba(239,68,68,0.15) 0%, rgba(239,68,68,0.05) 100%)', padding: '16px 20px', borderBottom: '1px solid rgba(239,68,68,0.1)' }}>
                  <div style={{ fontWeight: '800', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px' }}>
                    <Skull size={20} /> CEMENTERIO
                  </div>
                </div>
                <div style={{ padding: '20px' }}>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.6' }}>
                    <strong>CUARENTENA.</strong> No usar tarjetas, no pautar, no vincular activos limpios.
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {cementerios.map(bm => {
                      const bmAds = ads.filter(a => a.bm_id === bm.id);
                      const debt = bmAds.reduce((sum, a) => sum + (a.current_balance || 0), 0);
                      return (
                        <div key={bm.id} style={{ background: 'var(--bg-primary)', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #ef4444', boxShadow: '0 2px 6px rgba(239,68,68,0.05)' }}>
                          <div style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>☠️ {bm.name}</div>
                          {debt > 0 && <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '6px', fontWeight: 'bold', background: 'rgba(239,68,68,0.1)', padding: '4px 8px', borderRadius: '4px', display: 'inline-block' }}>Deuda: ${debt.toLocaleString()}</div>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
};

export default IdealArchitecture;
