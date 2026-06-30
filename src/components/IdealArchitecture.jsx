import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, Package, Skull, Smartphone, Box, Shield, Share2, Network, Globe, User, Briefcase, Megaphone, Code, ChevronRight, ArrowDown } from 'lucide-react';

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
   Visual Node Component  
   ────────────────────────────────────────────── */
const DiagramNode = ({ icon: Icon, label, sublabel, color, bg, size = 'md', badge, onClick, glow }) => {
  const sizes = {
    lg: { w: 240, h: 80, iconSize: 34, fontSize: '20px', subSize: '14px', radius: '16px', pad: '18px 24px' },
    md: { w: 190, h: 64, iconSize: 24, fontSize: '16px', subSize: '12px', radius: '12px', pad: '14px 18px' },
    sm: { w: 170, h: 56, iconSize: 20, fontSize: '14px', subSize: '11px', radius: '10px', pad: '12px 14px' },
  };
  const s = sizes[size];
  return (
    <div onClick={onClick} style={{
      background: bg || `${color}15`,
      border: `2px solid ${color}60`,
      borderRadius: s.radius,
      padding: s.pad,
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'all 0.3s',
      position: 'relative',
      boxShadow: glow ? `0 0 24px ${color}40, 0 6px 16px rgba(0,0,0,0.1)` : '0 2px 8px rgba(0,0,0,0.05)',
      minWidth: s.w + 'px',
      maxWidth: '280px',
    }}>
      <div style={{ 
        width: s.iconSize + 12 + 'px', height: s.iconSize + 12 + 'px', 
        borderRadius: '50%', background: `${color}25`, 
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 
      }}>
        <Icon size={s.iconSize} color={color} />
      </div>
      <div style={{ overflow: 'hidden' }}>
        <div style={{ fontSize: s.fontSize, fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</div>
        {sublabel && <div style={{ fontSize: s.subSize, color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sublabel}</div>}
      </div>
      {badge && (
        <div style={{ position: 'absolute', top: '-10px', right: '-10px', background: badge.color, color: '#fff', fontSize: '11px', fontWeight: 800, padding: '3px 10px', borderRadius: '12px', whiteSpace: 'nowrap' }}>
          {badge.text}
        </div>
      )}
    </div>
  );
};

/* ──────────────────────────────────────────────
   Arrow / Connector 
   ────────────────────────────────────────────── */
const Arrow = ({ color = '#6b7280', label, dashed }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', padding: '8px 0' }}>
    <div style={{ width: '3px', height: '28px', background: color, borderStyle: dashed ? 'dashed' : 'solid' }} />
    {label && <div style={{ fontSize: '13px', color, fontWeight: 700, padding: '4px 14px', background: `${color}10`, borderRadius: '6px', whiteSpace: 'nowrap' }}>{label}</div>}
    <div style={{ width: 0, height: 0, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderTop: `10px solid ${color}` }} />
  </div>
);

const HorizontalArrow = ({ color = '#6b7280', label, direction = 'right' }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '0 4px' }}>
    {direction === 'left' && <div style={{ width: 0, height: 0, borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderRight: `8px solid ${color}` }} />}
    <div style={{ height: '2px', width: '30px', background: color }} />
    {label && <div style={{ fontSize: '9px', color, fontWeight: 700, whiteSpace: 'nowrap' }}>{label}</div>}
    <div style={{ height: '2px', width: '30px', background: color }} />
    {direction === 'right' && <div style={{ width: 0, height: 0, borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderLeft: `8px solid ${color}` }} />}
  </div>
);

/* ──────────────────────────────────────────────
   Asset Cluster (group of small nodes)
   ────────────────────────────────────────────── */
const AssetCluster = ({ items, icon: Icon, color, label }) => (
  <div style={{ 
    background: `${color}08`, border: `1px solid ${color}25`, borderRadius: '12px', 
    padding: '14px', minWidth: '180px', maxWidth: '260px', flex: '1 1 180px'
  }}>
    <div style={{ fontSize: '14px', fontWeight: 800, color, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Icon size={18} /> {label} ({items.length})
    </div>
    {items.slice(0, 6).map((item, i) => (
      <div key={i} style={{ fontSize: '13px', color: 'var(--text-primary)', padding: '3px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: color, flexShrink: 0 }} />
        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item}</span>
      </div>
    ))}
    {items.length > 6 && <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '4px' }}>+{items.length - 6} más...</div>}
  </div>
);

/* ──────────────────────────────────────────────
   Profile Diagram (the main visual flowchart)
   ────────────────────────────────────────────── */
const ProfileDiagram = ({ profile, color, bms, ads, was, pxs, pages, isRented, isMoreLogin }) => {
  const profileBMs = bms.filter(b => b.facebook_profile === profile);

  const warriors = [];
  const reserves = [];
  const cemetery = [];

  profileBMs.forEach(bm => {
    const zone = classifyBM(bm, ads);
    if (zone === 'CEMENTERIO') cemetery.push(bm);
    else if (zone === 'RIESGO' || zone === 'GUERRERO') warriors.push(bm);
    else reserves.push(bm);
  });

  const allWAs = was.filter(w => profileBMs.some(b => b.id === w.bm_id));
  const allPxs = pxs.filter(p => profileBMs.some(b => b.id === p.bm_id));
  const allPages = pages.filter(p => profileBMs.some(b => b.id === p.bm_id));
  const totalDebt = profileBMs.reduce((sum, bm) => sum + ads.filter(a => a.bm_id === bm.id).reduce((s, a) => s + (a.current_balance || 0), 0), 0);

  return (
    <div style={{ padding: '30px 20px', minHeight: '500px' }}>
      
      {/* ═══ LAYER 0: PROFILE ═══ */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0' }}>
        <DiagramNode 
          icon={User} label={profile} 
          sublabel={`${profileBMs.length} BMs | ${isMoreLogin ? 'MoreLogin' : isRented ? 'Alquilada' : 'Navegador'}`}
          color={color} size="lg" glow={true}
          badge={totalDebt > 0 ? { text: `Deuda: $${(totalDebt/1000000).toFixed(1)}M`, color: '#ef4444' } : null}
        />
      </div>

      <Arrow color={color} label="Es dueño de" />

      {/* ═══ LAYER 1: BÓVEDA (if not rented) ═══ */}
      {!isRented ? (
        <>
          <div style={{ 
            background: `${color}08`, border: `2px dashed ${color}50`, borderRadius: '16px', 
            padding: '20px', margin: '0 auto', maxWidth: '700px',
            position: 'relative'
          }}>
            <div style={{ 
              position: 'absolute', top: '-12px', left: '20px', 
              background: color, color: '#fff', fontSize: '12px', fontWeight: 800, 
              padding: '6px 18px', borderRadius: '24px',
              display: 'flex', alignItems: 'center', gap: '8px'
          }}>
            <ShieldCheck size={18} /> BÓVEDA (BM Reciclado — Sin Pauta)
            </div>

            <div style={{ marginTop: '14px', fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Elige un BM Reserva limpio → cámbiale el nombre → centraliza aquí todos tus activos. Aquí conectas <strong style={{ color: '#25d366' }}>Chatify</strong> y <strong style={{ color: '#f59e0b' }}>Shopyeasy</strong>.
            </div>

            {/* Assets Row */}
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <AssetCluster items={allWAs.map(w => w.name || w.phone)} icon={Smartphone} color="#25d366" label="WhatsApps (Chatify)" />
              <AssetCluster items={allPxs.map(p => p.name)} icon={Code} color="#f59e0b" label="Píxeles (Shopyeasy)" />
              <AssetCluster items={allPages.map(p => p.name)} icon={Globe} color="#3b82f6" label="Fan Pages" />
            </div>
          </div>

          <Arrow color="#06b6d4" label="⚡ Comparte Píxel como SOCIO →" />
        </>
      ) : (
        /* Rented profile: no vault, just show assets in the BMs directly */
        <div style={{ textAlign: 'center', padding: '10px', fontSize: '13px', color: '#f43f5e', fontWeight: 700 }}>
          ⚠️ Perfil Alquilado — No se puede crear Bóveda. Solo pautar con lo que hay.
        </div>
      )}

      {/* ═══ LAYER 2: GUERREROS ═══ */}
      {warriors.length > 0 && (
        <div style={{ 
          background: '#06b6d408', border: '2px solid #06b6d425', borderRadius: '16px', 
          padding: '20px', margin: '0 auto', maxWidth: '700px',
          position: 'relative'
        }}>
          <div style={{ 
            position: 'absolute', top: '-12px', left: '20px', 
            background: '#06b6d4', color: '#fff', fontSize: '12px', fontWeight: 800, 
            padding: '6px 18px', borderRadius: '24px',
            display: 'flex', alignItems: 'center', gap: '6px'
          }}>
            <Megaphone size={14} /> GUERREROS — Pauta Activa ({warriors.length})
          </div>

          <div style={{ marginTop: '10px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {warriors.map(bm => {
              const bmAds = ads.filter(a => a.bm_id === bm.id);
              const debt = bmAds.reduce((s, a) => s + (a.current_balance || 0), 0);
              const bmWAs = was.filter(w => w.bm_id === bm.id);
              const bmPxs = pxs.filter(p => p.bm_id === bm.id);
              return (
                <DiagramNode 
                  key={bm.id} icon={Briefcase} label={bm.name} 
                  sublabel={`${bmAds.length} ctas | ${bmWAs.length} WA | ${bmPxs.length} Px`}
                  color={debt > 1000000 ? '#ef4444' : '#06b6d4'} size="sm"
                  badge={debt > 0 ? { text: `$${(debt/1000000).toFixed(1)}M`, color: '#ef4444' } : null}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* ═══ LAYER 3: RESERVAS ═══ */}
      {reserves.length > 0 && (
        <>
          <Arrow color="#8b5cf6" label="Activar cuando caiga un Guerrero" dashed={true} />
          <div style={{ 
            background: '#8b5cf608', border: '2px dashed #8b5cf625', borderRadius: '16px', 
            padding: '20px', margin: '0 auto', maxWidth: '700px',
            position: 'relative'
          }}>
            <div style={{ 
              position: 'absolute', top: '-12px', left: '20px', 
              background: '#8b5cf6', color: '#fff', fontSize: '12px', fontWeight: 800, 
              padding: '6px 18px', borderRadius: '24px',
              display: 'flex', alignItems: 'center', gap: '6px'
            }}>
              <Package size={14} /> RESERVAS — En Banca ({reserves.length})
            </div>

            <div style={{ marginTop: '10px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {reserves.map(bm => {
                const bmPages = pages.filter(p => p.bm_id === bm.id);
                const bmWAs = was.filter(w => w.bm_id === bm.id);
                return (
                  <DiagramNode 
                    key={bm.id} icon={Package} label={bm.name} 
                    sublabel={`${bmPages.length} pág | ${bmWAs.length} WA`}
                    color="#8b5cf6" size="sm"
                  />
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* ═══ LAYER 4: CEMENTERIO ═══ */}
      {cemetery.length > 0 && (
        <>
          <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0' }}>
            <div style={{ 
              background: 'repeating-linear-gradient(45deg, #ef444410, #ef444410 10px, transparent 10px, transparent 20px)',
              height: '3px', width: '200px'
            }} />
          </div>
          <div style={{ 
            background: '#ef444408', border: '2px solid #ef444425', borderRadius: '16px', 
            padding: '20px', margin: '0 auto', maxWidth: '700px',
            position: 'relative',
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(239,68,68,0.03) 35px, rgba(239,68,68,0.03) 70px)'
          }}>
            <div style={{ 
              position: 'absolute', top: '-12px', left: '20px', 
              background: '#ef4444', color: '#fff', fontSize: '12px', fontWeight: 800, 
              padding: '6px 18px', borderRadius: '24px',
              display: 'flex', alignItems: 'center', gap: '6px'
            }}>
              <Skull size={14} /> CEMENTERIO — NO TOCAR ({cemetery.length})
            </div>

            <div style={{ marginTop: '10px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {cemetery.map(bm => {
                const debt = ads.filter(a => a.bm_id === bm.id).reduce((s, a) => s + (a.current_balance || 0), 0);
                return (
                  <DiagramNode 
                    key={bm.id} icon={Skull} label={bm.name} 
                    sublabel={`Deuda: $${(debt/1000000).toFixed(1)}M`}
                    color="#ef4444" size="sm"
                  />
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

/* ──────────────────────────────────────────────
   MAIN COMPONENT
   ────────────────────────────────────────────── */
const IdealArchitecture = ({ bms, ads, was, pxs, pages }) => {
  const profiles = [
    { name: 'Paula Rojas', color: '#a855f7', rented: false, morelogin: false },
    { name: 'Luz Angela', color: '#10b981', rented: false, morelogin: false },
    { name: 'Nelson Lopez', color: '#3b82f6', rented: false, morelogin: true },
    { name: 'Gabriela Teguchi', color: '#f43f5e', rented: true, morelogin: false },
  ];
  const [selectedProfile, setSelectedProfile] = useState(0);
  const current = profiles[selectedProfile];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0', animation: 'fadeIn 0.5s ease-out' }}>
      
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(168,85,247,0.1), rgba(6,182,212,0.05))',
        border: '1px solid rgba(168,85,247,0.3)', borderLeft: '4px solid #a855f7',
        padding: '16px 20px', borderRadius: '12px', marginBottom: '16px'
      }}>
        <h3 style={{ color: '#a855f7', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '18px' }}>
          <Network size={22} /> Diagrama de Contingencia — Bóvedas Descentralizadas
        </h3>
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.5' }}>
          Selecciona un perfil para ver su diagrama completo de contingencia: Perfil → Bóveda → Guerreros → Reservas → Cementerio.
        </p>
      </div>

      {/* Profile Selector Tabs */}
      <div style={{ 
        display: 'flex', gap: '8px', marginBottom: '0', 
        background: 'var(--bg-secondary)', padding: '8px', borderRadius: '12px 12px 0 0',
        border: '1px solid var(--border-color)', borderBottom: 'none'
      }}>
        {profiles.map((p, i) => {
          const profileBMs = bms.filter(b => b.facebook_profile === p.name);
          const profileWAs = was.filter(w => profileBMs.some(b => b.id === w.bm_id));
          return (
            <button key={p.name} onClick={() => setSelectedProfile(i)} style={{
              flex: 1,
              background: selectedProfile === i ? `${p.color}15` : 'transparent',
              border: selectedProfile === i ? `2px solid ${p.color}` : '2px solid transparent',
              borderRadius: '8px',
              padding: '10px 14px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={16} color={selectedProfile === i ? p.color : 'var(--text-tertiary)'} />
                <span style={{ fontWeight: 700, fontSize: '14px', color: selectedProfile === i ? p.color : 'var(--text-secondary)' }}>{p.name}</span>
                {p.rented && <span style={{ background: '#f43f5e20', color: '#f43f5e', fontSize: '9px', fontWeight: 800, padding: '1px 5px', borderRadius: '4px' }}>ALQUILADA</span>}
                {p.morelogin && <span style={{ background: '#3b82f620', color: '#3b82f6', fontSize: '9px', fontWeight: 800, padding: '1px 5px', borderRadius: '4px' }}>MORELOGIN</span>}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                {profileBMs.length} BMs · {profileWAs.length} WAs
              </div>
            </button>
          );
        })}
      </div>

      {/* Diagram Area */}
      <div style={{ 
        background: 'var(--bg-secondary)', 
        border: '1px solid var(--border-color)', 
        borderRadius: '0 0 12px 12px',
        backgroundImage: 'radial-gradient(circle, var(--border-color) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        minHeight: '500px'
      }}>
        <ProfileDiagram 
          profile={current.name} color={current.color}
          bms={bms} ads={ads} was={was} pxs={pxs} pages={pages}
          isRented={current.rented} isMoreLogin={current.morelogin}
        />
      </div>
    </div>
  );
};

export default IdealArchitecture;
