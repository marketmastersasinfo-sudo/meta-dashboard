import React from 'react';
import { ShieldCheck, ShieldAlert, Package, Skull, ArrowRight, Smartphone, Box } from 'lucide-react';

const IdealArchitecture = ({ bms, ads, was, pxs }) => {
  const profiles = ['Paula Rojas', 'Luz Angela', 'Gabriela Teguchi'];

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <div className="glass-card" style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid var(--success)', padding: '24px', borderRadius: '12px' }}>
        <h3 style={{ color: 'var(--success)', marginTop: 0, display: 'flex', alignItems: 'center', gap: '10px', fontSize: '20px' }}>
          <ShieldCheck size={24} /> Arquitectura de Contingencia Ideal (Modelo A + C)
        </h3>
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.6' }}>
          Este diagrama muestra cómo debes <strong>reorganizar tus activos actuales</strong>. Las <strong>Bóvedas</strong> deben crearse desde cero en MoreLogin (NUNCA deben pautar) y almacenarán todos los Píxeles y WhatsApps. Los <strong>Guerreros</strong> reciben el pixel compartido desde la Bóveda vía Socio y son los únicos que hacen anuncios. El <strong>Cementerio</strong> queda en cuarentena permanente para no contaminar.
        </p>
      </div>

      {profiles.map(profile => {
        const { guerreros, reservas, cementerios, profileWAs, profilePxs } = getProfileAssets(profile);
        
        // Si no tiene nada, no mostrar
        if (guerreros.length === 0 && reservas.length === 0 && cementerios.length === 0) return null;

        return (
          <div key={profile} style={{ background: 'var(--bg-secondary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', overflowX: 'auto' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px', marginBottom: '24px', color: '#fff' }}>
              Perfil MoreLogin: {profile.toUpperCase()}
            </h2>

            {/* Grid de 4 Columnas */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1.2fr) 40px minmax(250px, 1fr) minmax(220px, 1fr) minmax(220px, 1fr)', gap: '12px', alignItems: 'stretch' }}>
              
              {/* COL 1: BOVEDAS */}
              <div style={{ border: '2px dashed #a855f7', borderRadius: '10px', padding: '20px', background: 'rgba(168,85,247,0.08)' }}>
                <div style={{ fontWeight: '800', color: '#a855f7', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px' }}>
                  <ShieldCheck size={20} /> CAPA 1: BÓVEDA (Crear)
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.5' }}>
                  Abre tu perfil en el Antidetect. Crea un BM 100% nuevo. <strong>NO le agregues tarjetas. NO hagas anuncios.</strong> Mueve todos estos activos hacia allí:
                </div>
                
                {profileWAs.length > 0 && (
                  <div style={{ marginBottom: '16px' }}>
                    <strong style={{ color: 'var(--success)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}><Smartphone size={16}/> Mover WhatsApps:</strong>
                    {profileWAs.map(w => <div key={w.id} style={{ fontSize: '13px', paddingLeft: '22px', color: '#e5e7eb', marginBottom: '4px' }}>• {w.name || w.phone}</div>)}
                  </div>
                )}
                {profilePxs.length > 0 && (
                  <div>
                    <strong style={{ color: '#f59e0b', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}><Box size={16}/> Mover Píxeles:</strong>
                    {profilePxs.map(p => <div key={p.id} style={{ fontSize: '13px', paddingLeft: '22px', color: '#e5e7eb', marginBottom: '4px' }}>• {p.name}</div>)}
                  </div>
                )}
              </div>

              {/* FLECHAS */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)' }}>
                <ArrowRight size={24} />
                <span style={{ fontSize: '11px', writingMode: 'vertical-rl', marginTop: '12px', fontWeight: 'bold', letterSpacing: '1px' }}>COMPARTIR COMO SOCIO</span>
              </div>

              {/* COL 2: GUERREROS */}
              <div style={{ border: '2px solid #06b6d4', borderRadius: '10px', padding: '20px', background: 'rgba(6,182,212,0.08)' }}>
                <div style={{ fontWeight: '800', color: '#06b6d4', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px' }}>
                  <ShieldAlert size={20} /> CAPA 2: GUERREROS
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.5' }}>
                  Reciben los píxeles de la Bóveda vía invitación de SOCIO. <strong>Máximo 2 cuentas activas por cada tarjeta nueva.</strong>
                </div>
                {guerreros.length === 0 ? <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>No hay Guerreros activos actualmente.</div> : null}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {guerreros.map(bm => (
                    <div key={bm.id} style={{ background: 'var(--bg-primary)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(6,182,212,0.4)', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                      <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#fff' }}>⚔️ {bm.name}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* COL 3: RESERVAS */}
              <div style={{ border: '2px solid #3b82f6', borderRadius: '10px', padding: '20px', background: 'rgba(59,130,246,0.08)' }}>
                <div style={{ fontWeight: '800', color: '#3b82f6', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px' }}>
                  <Package size={20} /> CAPA 3: RESERVAS
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.5' }}>
                  BMs limpios congelados. Listos para recibir Píxeles de la Bóveda cuando un Guerrero caiga baneado.
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {reservas.slice(0, 7).map(bm => (
                    <div key={bm.id} style={{ background: 'var(--bg-primary)', padding: '10px', borderRadius: '6px', fontSize: '13px', border: '1px solid rgba(59,130,246,0.3)' }}>
                      📦 {bm.name}
                    </div>
                  ))}
                  {reservas.length > 7 && <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 'bold', marginTop: '4px' }}>+ {reservas.length - 7} BMs de reserva...</div>}
                </div>
              </div>

              {/* COL 4: CEMENTERIO */}
              <div style={{ border: '2px solid #ef4444', borderRadius: '10px', padding: '20px', background: 'rgba(239,68,68,0.08)' }}>
                <div style={{ fontWeight: '800', color: '#ef4444', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px' }}>
                  <Skull size={20} /> CEMENTERIO
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.5' }}>
                  <strong>ZONA TÓXICA.</strong> No agregar tarjetas. No compartir píxeles. La deuda se congela.
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {cementerios.map(bm => {
                    const bmAds = ads.filter(a => a.bm_id === bm.id);
                    const debt = bmAds.reduce((sum, a) => sum + (a.current_balance || 0), 0);
                    return (
                      <div key={bm.id} style={{ background: 'var(--bg-primary)', padding: '10px', borderRadius: '6px', fontSize: '13px', border: '1px solid rgba(239,68,68,0.5)' }}>
                        <div style={{ fontWeight: 'bold', color: '#fff' }}>☠️ {bm.name}</div>
                        {debt > 0 && <div style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', fontWeight: 'bold' }}>Deuda: ${debt.toLocaleString()}</div>}
                      </div>
                    );
                  })}
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
