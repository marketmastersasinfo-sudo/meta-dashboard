import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, Package, Skull, Smartphone, Box, Shield, Plus, Share2, Server, Network, ChevronDown, ChevronRight, Globe, Image, CreditCard, AlertTriangle } from 'lucide-react';

/* ──────────────────────────────────────────────
   Helper: classify a BM into a zone
   ────────────────────────────────────────────── */
const classifyBM = (bm, ads) => {
  const bmAds = ads.filter(a => a.bm_id === bm.id);
  const debt = bmAds.reduce((s, a) => s + (a.current_balance || 0), 0);
  const activeAds = bmAds.filter(a => a.status === 'ACTIVE');
  const hasDebt = debt > 500000;
  const allDead = bmAds.length > 0 && bmAds.every(a => a.status !== 'ACTIVE');

  if (hasDebt && allDead) return 'CEMENTERIO';
  if (hasDebt) return 'RIESGO';
  if (activeAds.length > 0) return 'GUERRERO';
  return 'RESERVA';
};

/* ──────────────────────────────────────────────
   Sub-component: a single BM card with all its assets
   ────────────────────────────────────────────── */
const BMCard = ({ bm, ads, was, pxs, pages, zoneColor, zoneIcon, zoneLabel }) => {
  const [expanded, setExpanded] = useState(false);
  const bmAds = ads.filter(a => a.bm_id === bm.id);
  const bmWAs = was.filter(w => w.bm_id === bm.id);
  const bmPxs = pxs.filter(p => p.bm_id === bm.id);
  const bmPages = pages.filter(p => p.bm_id === bm.id);
  const debt = bmAds.reduce((s, a) => s + (a.current_balance || 0), 0);
  const totalAssets = bmWAs.length + bmPxs.length + bmPages.length;

  return (
    <div style={{
      background: 'var(--bg-primary)',
      border: `1px solid ${zoneColor}30`,
      borderLeft: `3px solid ${zoneColor}`,
      borderRadius: '8px',
      marginBottom: '8px',
      fontSize: '14px',
      overflow: 'hidden'
    }}>
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '8px 12px', cursor: 'pointer',
          background: expanded ? `${zoneColor}08` : 'transparent'
        }}
      >
        {expanded ? <ChevronDown size={14} color={zoneColor} /> : <ChevronRight size={14} color={zoneColor} />}
        <span style={{ fontWeight: 700, color: 'var(--text-primary)', flex: 1 }}>{bm.name}</span>
        {debt > 0 && (
          <span style={{ color: '#ef4444', fontWeight: 700, fontSize: '13px' }}>
            ${(debt / 1000000).toFixed(1)}M
          </span>
        )}
        <span style={{ color: 'var(--text-tertiary)', fontSize: '12px' }}>
          {totalAssets} activos
        </span>
      </div>

      {expanded && (
        <div style={{ padding: '4px 12px 10px 32px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {bmAds.length > 0 && (
            <div style={{ color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '4px' }}>
              <CreditCard size={12} style={{ display: 'inline', marginRight: '4px' }} />
              {bmAds.length} cuentas pub. | {bmAds.filter(a => a.status === 'ACTIVE').length} activas
            </div>
          )}
          {bmWAs.map(w => (
            <div key={w.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#25d366', padding: '2px 0' }}>
              <Smartphone size={14} /> <span style={{ color: 'var(--text-primary)', fontSize: '13px' }}>{w.name || w.phone}</span>
            </div>
          ))}
          {bmPxs.map(p => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', padding: '2px 0' }}>
              <Box size={14} /> <span style={{ color: 'var(--text-primary)', fontSize: '13px' }}>{p.name}</span>
            </div>
          ))}
          {bmPages.map(p => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#3b82f6', padding: '2px 0' }}>
              <Globe size={14} /> <span style={{ color: 'var(--text-primary)', fontSize: '13px' }}>{p.name}</span>
            </div>
          ))}
          {totalAssets === 0 && bmAds.length === 0 && (
            <div style={{ color: 'var(--text-tertiary)', fontStyle: 'italic' }}>Sin activos registrados</div>
          )}
        </div>
      )}
    </div>
  );
};

/* ──────────────────────────────────────────────
   Sub-component: Profile Ecosystem Node
   ────────────────────────────────────────────── */
const ProfileNode = ({ profile, color, bms, ads, was, pxs, pages, isRented, isMoreLogin }) => {
  const profileBMs = bms.filter(b => b.facebook_profile === profile);

  // Classify BMs
  const vaultCandidates = [];
  const warriors = [];
  const reserves = [];
  const cemetery = [];

  profileBMs.forEach(bm => {
    const zone = classifyBM(bm, ads);
    if (zone === 'CEMENTERIO') cemetery.push(bm);
    else if (zone === 'RIESGO') warriors.push(bm); // risky but active
    else if (zone === 'GUERRERO') warriors.push(bm);
    else reserves.push(bm);
  });

  // Gather ALL WAs and Pixels across this profile's BMs
  const allProfileWAs = was.filter(w => profileBMs.some(b => b.id === w.bm_id));
  const allProfilePxs = pxs.filter(p => profileBMs.some(b => b.id === p.bm_id));
  const allProfilePages = pages.filter(p => profileBMs.some(b => b.id === p.bm_id));

  // Stats
  const totalDebt = profileBMs.reduce((sum, bm) => {
    return sum + ads.filter(a => a.bm_id === bm.id).reduce((s, a) => s + (a.current_balance || 0), 0);
  }, 0);

  return (
    <div style={{
      background: 'var(--bg-primary)',
      borderRadius: '16px',
      border: `2px solid ${color}40`,
      overflow: 'hidden',
      boxShadow: `0 8px 24px ${color}10`,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* HEADER */}
      <div style={{
        background: `linear-gradient(135deg, ${color}20, ${color}05)`,
        padding: '14px 18px',
        borderBottom: `1px solid ${color}30`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Server size={18} color={color} />
          <h3 style={{ margin: 0, color: color, fontSize: '16px', fontWeight: 800, flex: 1 }}>{profile}</h3>
          {isRented && <span style={{ background: '#f43f5e20', color: '#f43f5e', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 700 }}>ALQUILADA</span>}
          {isMoreLogin && <span style={{ background: '#3b82f620', color: '#3b82f6', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 700 }}>MORELOGIN</span>}
        </div>
        <div style={{ display: 'flex', gap: '16px', marginTop: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
          <span>{profileBMs.length} BMs</span>
          <span style={{ color: '#25d366' }}>{allProfileWAs.length} WAs</span>
          <span style={{ color: '#f59e0b' }}>{allProfilePxs.length} Píxeles</span>
          <span style={{ color: '#3b82f6' }}>{allProfilePages.length} Páginas</span>
          {totalDebt > 0 && <span style={{ color: '#ef4444', fontWeight: 700 }}>Deuda: ${(totalDebt / 1000000).toFixed(1)}M</span>}
        </div>
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px', flexGrow: 1 }}>

        {/* BÓVEDA SECTION (only if not rented) */}
        {!isRented && (
          <div style={{
            background: 'var(--bg-secondary)',
            border: `2px dashed ${color}`,
            borderRadius: '10px',
            padding: '14px'
          }}>
            <div style={{ fontWeight: 800, color: color, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px' }}>
              <ShieldCheck size={18} />
              BÓVEDA (BM Reciclado → Sin Pauta)
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '10px', lineHeight: '1.5' }}>
              Elige uno de tus BMs Reserva limpios y conviértelo en Bóveda. Aquí centralizas todos los WAs (Chatify) y Píxeles (Shopyeasy).
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
              <div style={{ background: 'var(--bg-primary)', padding: '10px', borderRadius: '6px', borderLeft: '3px solid #25d366' }}>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#25d366', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <Smartphone size={14} /> Para Chatify ({allProfileWAs.length} WAs)
                </div>
                {allProfileWAs.map(w => (
                  <div key={w.id} style={{ fontSize: '12px', color: 'var(--text-primary)', padding: '2px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    • {w.name || w.phone}
                  </div>
                ))}
                {allProfileWAs.length === 0 && <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Sin WAs</div>}
              </div>

              <div style={{ background: 'var(--bg-primary)', padding: '10px', borderRadius: '6px', borderLeft: '3px solid #f59e0b' }}>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <Box size={14} /> Para Shopyeasy ({allProfilePxs.length} Pxs)
                </div>
                {allProfilePxs.map(p => (
                  <div key={p.id} style={{ fontSize: '12px', color: 'var(--text-primary)', padding: '2px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    • {p.name}
                  </div>
                ))}
                {allProfilePxs.length === 0 && <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Sin Píxeles</div>}
              </div>
            </div>

            {/* Vault Arrow */}
            <div style={{ textAlign: 'center', color: color, fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '8px' }}>
              <Share2 size={12} /> Comparte Píxel como Socio a los Guerreros ↓
            </div>
          </div>
        )}

        {/* GUERREROS */}
        {warriors.length > 0 && (
          <div>
            <div style={{ fontWeight: 800, color: '#06b6d4', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px' }}>
              <ShieldAlert size={16} /> GUERREROS — Pauta Activa ({warriors.length})
            </div>
            {warriors.map(bm => (
              <BMCard key={bm.id} bm={bm} ads={ads} was={was} pxs={pxs} pages={pages} zoneColor="#06b6d4" />
            ))}
          </div>
        )}

        {/* RESERVAS */}
        {reserves.length > 0 && (
          <div>
            <div style={{ fontWeight: 800, color: '#8b5cf6', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px' }}>
              <Package size={16} /> RESERVAS — Listos para Activar ({reserves.length})
            </div>
            {reserves.map(bm => (
              <BMCard key={bm.id} bm={bm} ads={ads} was={was} pxs={pxs} pages={pages} zoneColor="#8b5cf6" />
            ))}
          </div>
        )}

        {/* CEMENTERIO */}
        {cemetery.length > 0 && (
          <div>
            <div style={{ fontWeight: 800, color: '#ef4444', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px' }}>
              <Skull size={16} /> CEMENTERIO — No Tocar ({cemetery.length})
            </div>
            {cemetery.map(bm => (
              <BMCard key={bm.id} bm={bm} ads={ads} was={was} pxs={pxs} pages={pages} zoneColor="#ef4444" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* ──────────────────────────────────────────────
   Sub-component: Scalability Template
   ────────────────────────────────────────────── */
const ScalabilityTemplate = () => (
  <div style={{
    background: 'var(--bg-primary)',
    borderRadius: '16px',
    border: '2px dashed #f59e0b40',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  }}>
    <div style={{ background: 'linear-gradient(135deg, #f59e0b20, #f59e0b05)', padding: '14px 18px', borderBottom: '1px dashed #f59e0b30' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Plus size={18} color="#f59e0b" />
        <h3 style={{ margin: 0, color: '#f59e0b', fontSize: '16px', fontWeight: 800 }}>PLANTILLA: Nuevo Perfil</h3>
      </div>
      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
        Replica este modelo para cada perfil antidetect nuevo que compres.
      </div>
    </div>
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ background: 'var(--bg-secondary)', border: '2px dashed #f59e0b', borderRadius: '10px', padding: '14px' }}>
        <div style={{ fontWeight: 800, color: '#f59e0b', marginBottom: '8px', fontSize: '13px' }}>🛡️ BÓVEDA-[NOMBRE]</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <div style={{ background: 'var(--bg-primary)', padding: '8px', borderRadius: '6px', borderLeft: '3px solid #25d366', fontSize: '11px' }}>
            <strong style={{ color: '#25d366' }}>Chatify:</strong> <span style={{ color: 'var(--text-secondary)' }}>Nuevo WA</span>
          </div>
          <div style={{ background: 'var(--bg-primary)', padding: '8px', borderRadius: '6px', borderLeft: '3px solid #f59e0b', fontSize: '11px' }}>
            <strong style={{ color: '#f59e0b' }}>Shopyeasy:</strong> <span style={{ color: 'var(--text-secondary)' }}>Nuevo Pixel</span>
          </div>
        </div>
        <div style={{ textAlign: 'center', color: '#f59e0b', fontSize: '10px', fontWeight: 700, marginTop: '8px' }}>
          <Share2 size={10} style={{ display: 'inline', marginRight: '4px' }} /> Comparte Píxel ↓
        </div>
      </div>
      <div style={{ background: 'var(--bg-secondary)', border: '1px solid #06b6d420', borderRadius: '8px', padding: '10px' }}>
        <div style={{ fontWeight: 700, color: '#06b6d4', fontSize: '12px', marginBottom: '6px' }}>⚔️ GUERREROS</div>
        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>BM Guerrero 1 (Recibe Pixel + Tarjeta)</div>
        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>BM Guerrero 2 (Recibe Pixel + Tarjeta)</div>
      </div>
    </div>
  </div>
);

/* ──────────────────────────────────────────────
   MAIN COMPONENT
   ────────────────────────────────────────────── */
const IdealArchitecture = ({ bms, ads, was, pxs, pages }) => {
  // Global stats
  const totalWAs = was.length;
  const totalPxs = pxs.length;
  const totalPages = pages.length;
  const totalDebt = ads.reduce((s, a) => s + (a.current_balance || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', animation: 'fadeIn 0.5s ease-out' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%)',
        border: '1px solid rgba(168, 85, 247, 0.3)',
        borderLeft: '4px solid #a855f7',
        padding: '20px',
        borderRadius: '12px',
      }}>
        <h3 style={{ color: '#a855f7', marginTop: 0, display: 'flex', alignItems: 'center', gap: '10px', fontSize: '18px' }}>
          <Network size={22} /> Arquitectura de Bóvedas Descentralizadas
        </h3>
        <p style={{ margin: '0 0 12px 0', color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.6' }}>
          Cada perfil tiene su propia <strong>Bóveda</strong> (un BM reciclado sin pauta) que protege tus WAs y Píxeles para Chatify/Shopyeasy.
          Los <strong>Guerreros</strong> reciben el Pixel compartido y pautar con tarjeta. Si caen, la Bóveda está intacta.
        </p>
        <div style={{ display: 'flex', gap: '20px', fontSize: '12px', flexWrap: 'wrap' }}>
          <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{bms.length} BMs totales</span>
          <span style={{ color: '#25d366', fontWeight: 700 }}>{totalWAs} WhatsApps</span>
          <span style={{ color: '#f59e0b', fontWeight: 700 }}>{totalPxs} Píxeles</span>
          <span style={{ color: '#3b82f6', fontWeight: 700 }}>{totalPages} Páginas</span>
          <span style={{ color: '#ef4444', fontWeight: 700 }}>Deuda total: ${(totalDebt / 1000000).toFixed(1)}M COP</span>
        </div>
      </div>

      {/* Instruction */}
      <div style={{
        background: '#f59e0b10', border: '1px solid #f59e0b30', borderRadius: '8px', padding: '12px 16px',
        fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px'
      }}>
        <AlertTriangle size={16} color="#f59e0b" />
        <span>Haz clic en cualquier BM para ver todos sus activos internos (WhatsApps, Píxeles, Páginas, Cuentas Publicitarias).</span>
      </div>

      {/* Horizontal scroll of Profiles */}
      <div style={{ 
        display: 'flex', 
        gap: '24px', 
        overflowX: 'auto', 
        paddingBottom: '16px',
        scrollSnapType: 'x mandatory',
        WebkitOverflowScrolling: 'touch'
      }}>
        <div style={{ minWidth: '420px', maxWidth: '500px', flex: '0 0 420px', scrollSnapAlign: 'start' }}>
          <ProfileNode profile="Paula Rojas" color="#a855f7" bms={bms} ads={ads} was={was} pxs={pxs} pages={pages} isRented={false} isMoreLogin={false} />
        </div>
        <div style={{ minWidth: '420px', maxWidth: '500px', flex: '0 0 420px', scrollSnapAlign: 'start' }}>
          <ProfileNode profile="Luz Angela" color="#10b981" bms={bms} ads={ads} was={was} pxs={pxs} pages={pages} isRented={false} isMoreLogin={false} />
        </div>
        <div style={{ minWidth: '420px', maxWidth: '500px', flex: '0 0 420px', scrollSnapAlign: 'start' }}>
          <ProfileNode profile="Nelson Lopez" color="#3b82f6" bms={bms} ads={ads} was={was} pxs={pxs} pages={pages} isRented={false} isMoreLogin={true} />
        </div>
        <div style={{ minWidth: '420px', maxWidth: '500px', flex: '0 0 420px', scrollSnapAlign: 'start' }}>
          <ProfileNode profile="Gabriela Teguchi" color="#f43f5e" bms={bms} ads={ads} was={was} pxs={pxs} pages={pages} isRented={true} isMoreLogin={false} />
        </div>
        <div style={{ minWidth: '420px', maxWidth: '500px', flex: '0 0 420px', scrollSnapAlign: 'start' }}>
          <ScalabilityTemplate />
        </div>
      </div>
    </div>
  );
};

export default IdealArchitecture;
