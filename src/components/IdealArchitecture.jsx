import React, { useState } from 'react';
import { ShieldCheck, Package, Skull, Smartphone, Globe, User, Briefcase, Megaphone, Code, MessageCircle, Network, Lock, AlertTriangle, ArrowRight, CheckCircle, XCircle, HelpCircle } from 'lucide-react';

/* ──────────────────────────────────────────────
   PAULA ROJAS — Real Contingency Logic
   Based on approved plan with LLC verification,
   Bóveda Principal + Hub Chatify separation,
   and cemetery isolation protocol.
   ────────────────────────────────────────────── */

/* ── Helpers ── */
const getBMDebt = (bm, ads) => ads.filter(a => a.bm_id === bm.id).reduce((s, a) => s + (a.current_balance || 0), 0);
const getBMActiveAds = (bm, ads) => ads.filter(a => a.bm_id === bm.id && a.status === 'ACTIVE').length;

/* ── Reusable: Section Container ── */
const Section = ({ color, icon: Icon, title, subtitle, dashed, children, hazard }) => (
  <div style={{
    background: hazard
      ? `repeating-linear-gradient(45deg, ${color}04, ${color}04 20px, transparent 20px, transparent 40px)`
      : `${color}06`,
    border: `2px ${dashed ? 'dashed' : 'solid'} ${color}30`,
    borderRadius: '16px', padding: '24px', position: 'relative', margin: '0 auto', maxWidth: '860px'
  }}>
    <div style={{
      position: 'absolute', top: '-14px', left: '20px',
      background: color, color: '#fff', fontSize: '13px', fontWeight: 800,
      padding: '6px 18px', borderRadius: '24px',
      display: 'flex', alignItems: 'center', gap: '8px'
    }}>
      <Icon size={16} /> {title}
    </div>
    {subtitle && <div style={{ marginTop: '10px', fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.5' }}>{subtitle}</div>}
    <div style={{ marginTop: subtitle ? '0' : '14px' }}>{children}</div>
  </div>
);

/* ── Reusable: Asset Pill ── */
const AssetPill = ({ icon: Icon, label, color, status }) => (
  <div style={{
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    background: `${color}10`, border: `1px solid ${color}25`, borderRadius: '8px',
    padding: '6px 12px', fontSize: '13px', color: 'var(--text-primary)'
  }}>
    <Icon size={14} color={color} />
    <span style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
    {status === 'free' && <CheckCircle size={12} color="#22c55e" />}
    {status === 'trapped' && <Lock size={12} color="#ef4444" />}
    {status === 'attempt' && <HelpCircle size={12} color="#f59e0b" />}
  </div>
);

/* ── Reusable: BM Card ── */
const BMCard = ({ name, role, color, debt, activeAds, wasCount, pxCount, pgCount, badge, children }) => (
  <div style={{
    background: `${color}08`, border: `2px solid ${color}25`, borderRadius: '12px',
    padding: '14px 16px', minWidth: '200px', maxWidth: '260px', flex: '1 1 200px', position: 'relative'
  }}>
    {badge && (
      <div style={{ position: 'absolute', top: '-10px', right: '-6px', background: badge.color, color: '#fff', fontSize: '11px', fontWeight: 800, padding: '3px 10px', borderRadius: '12px' }}>
        {badge.text}
      </div>
    )}
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
      <Briefcase size={16} color={color} />
      <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)' }}>{name}</span>
    </div>
    {role && <div style={{ fontSize: '11px', fontWeight: 700, color, marginBottom: '6px', textTransform: 'uppercase' }}>{role}</div>}
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', fontSize: '11px', color: 'var(--text-secondary)' }}>
      {activeAds !== undefined && <span>{activeAds} ads</span>}
      {debt > 0 && <span style={{ color: '#ef4444', fontWeight: 700 }}>${(debt/1000000).toFixed(1)}M</span>}
      {wasCount > 0 && <span>📱{wasCount} WA</span>}
      {pxCount > 0 && <span>📊{pxCount} Px</span>}
      {pgCount > 0 && <span>📄{pgCount} Pg</span>}
    </div>
    {children}
  </div>
);

/* ── Arrow connector ── */
const FlowArrow = ({ color = '#6b7280', label, dashed }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', padding: '10px 0' }}>
    <div style={{ width: '3px', height: '24px', background: color, ...(dashed ? { backgroundImage: `repeating-linear-gradient(to bottom, ${color} 0px, ${color} 6px, transparent 6px, transparent 12px)`, background: 'none' } : {}) }} />
    {label && <div style={{ fontSize: '12px', color, fontWeight: 700, padding: '4px 14px', background: `${color}10`, borderRadius: '6px', whiteSpace: 'nowrap', textAlign: 'center' }}>{label}</div>}
    <div style={{ width: 0, height: 0, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderTop: `10px solid ${color}` }} />
  </div>
);

/* ══════════════════════════════════════════════
   MAIN COMPONENT — Paula Rojas Diagram
   ══════════════════════════════════════════════ */
const IdealArchitecture = ({ bms, ads, was, pxs, pages }) => {
  const profiles = [
    { name: 'Paula Rojas', color: '#a855f7' },
    { name: 'Luz Angela', color: '#10b981' },
    { name: 'Nelson Lopez', color: '#3b82f6' },
    { name: 'Gabriela Teguchi', color: '#f43f5e' },
  ];
  const [selectedProfile, setSelectedProfile] = useState(0);
  const current = profiles[selectedProfile];
  const profileBMs = bms.filter(b => b.facebook_profile === current.name);

  // Classify BMs for current profile
  const bovedaBM = profileBMs.find(b => b.name === 'distribuidoroficialpaulavelez');
  const hubChatifyBM = profileBMs.find(b => b.name === 'chileshop.co');

  const guerreroNames = ['myblustore.com', 'Comprasenunclickmx', 'argenshop.co1', 'monshopco'];
  const cementerioNames = ['Mundo Compra', 'myblustore', 'TupromoStore.com', 'clickshoes3', 'mascotilandia.co1', 'guateshop.co1'];
  const reservaExclude = [...guerreroNames, ...cementerioNames, 'distribuidoroficialpaulavelez', 'chileshop.co'];

  const guerreroBMs = profileBMs.filter(b => guerreroNames.includes(b.name));
  const cementerioBMs = profileBMs.filter(b => cementerioNames.includes(b.name));
  const reservaBMs = profileBMs.filter(b => !reservaExclude.includes(b.name));

  // Get assets for specific BMs
  const getWAs = (bmId) => was.filter(w => w.bm_id === bmId);
  const getPxs = (bmId) => pxs.filter(p => p.bm_id === bmId);
  const getPgs = (bmId) => pages.filter(p => p.bm_id === bmId);

  // Free vs trapped
  const freeWAs = was.filter(w => {
    const bm = bms.find(b => b.id === w.bm_id);
    return bm && bm.facebook_profile === current.name && getBMDebt(bm, ads) < 500000;
  }).filter(w => !(w.name || '').includes('Test'));

  const trappedWAs = was.filter(w => {
    const bm = bms.find(b => b.id === w.bm_id);
    return bm && bm.facebook_profile === current.name && getBMDebt(bm, ads) >= 500000;
  }).filter(w => !(w.name || '').includes('Test'));

  const freePxs = pxs.filter(p => {
    const bm = bms.find(b => b.id === p.bm_id);
    return bm && bm.facebook_profile === current.name && getBMDebt(bm, ads) < 500000;
  });

  const trappedPxs = pxs.filter(p => {
    const bm = bms.find(b => b.id === p.bm_id);
    return bm && bm.facebook_profile === current.name && getBMDebt(bm, ads) >= 500000;
  });

  const isPaula = current.name === 'Paula Rojas';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(168,85,247,0.08), rgba(6,182,212,0.04))',
        border: '1px solid rgba(168,85,247,0.2)', borderLeft: '4px solid #a855f7',
        padding: '16px 20px', borderRadius: '12px', marginBottom: '16px'
      }}>
        <h3 style={{ color: '#a855f7', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '18px' }}>
          <Network size={22} /> Plan de Contingencia Real — Bóvedas + Chatify + Shopyeasy
        </h3>
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '13px' }}>
          Estructura aprobada: Bóveda Principal (pixels + pages) → Hub Chatify (WhatsApps API) → Guerreros (pauta) → Reservas → Cementerio
        </p>
      </div>

      {/* Profile Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '0', background: 'var(--bg-secondary)', padding: '8px', borderRadius: '12px 12px 0 0', border: '1px solid var(--border-color)', borderBottom: 'none' }}>
        {profiles.map((p, i) => (
          <button key={p.name} onClick={() => setSelectedProfile(i)} style={{
            flex: 1, background: selectedProfile === i ? `${p.color}15` : 'transparent',
            border: selectedProfile === i ? `2px solid ${p.color}` : '2px solid transparent',
            borderRadius: '8px', padding: '10px 14px', cursor: 'pointer', transition: 'all 0.2s',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={16} color={selectedProfile === i ? p.color : 'var(--text-tertiary)'} />
              <span style={{ fontWeight: 700, fontSize: '14px', color: selectedProfile === i ? p.color : 'var(--text-secondary)' }}>{p.name}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Diagram Area */}
      <div style={{
        background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '0 0 12px 12px',
        backgroundImage: 'radial-gradient(circle, var(--border-color) 1px, transparent 1px)', backgroundSize: '24px 24px',
        padding: '30px 20px', minHeight: '600px'
      }}>
        {isPaula ? (
          /* ═══ PAULA ROJAS — Full Contingency Diagram ═══ */
          <div>
            {/* PROFILE NODE */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ background: `${current.color}12`, border: `3px solid ${current.color}`, borderRadius: '16px', padding: '18px 28px', display: 'flex', alignItems: 'center', gap: '14px', boxShadow: `0 0 30px ${current.color}30` }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: `${current.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={28} color={current.color} />
                </div>
                <div>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)' }}>Paula Rojas</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{profileBMs.length} BMs | Navegador | LLC disponible</div>
                </div>
              </div>
            </div>

            <FlowArrow color={current.color} label="Es dueña de" />

            {/* ═══ BÓVEDA PRINCIPAL ═══ */}
            <Section color="#10b981" icon={ShieldCheck} title="🛡️ BÓVEDA PRINCIPAL — distribuidoroficialpaulavelez" dashed
              subtitle={<>BM limpio que se verificará con la LLC. <strong style={{color:'#ef4444'}}>NUNCA pautar aquí.</strong> Guarda pixels, pages y los 2 WAs con historial. Aquí se conecta <strong style={{color:'#f59e0b'}}>Shopyeasy</strong>.</>}>
              
              {/* Assets inside Bóveda */}
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '8px' }}>
                {/* Free Pixels */}
                <div style={{ flex: '1 1 200px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#f59e0b', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Code size={15} /> Pixels (Shopyeasy) — {freePxs.length} libres
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {freePxs.map((p, i) => <AssetPill key={i} icon={Code} label={p.name} color="#f59e0b" status="free" />)}
                    {trappedPxs.slice(0, 3).map((p, i) => <AssetPill key={`t${i}`} icon={Code} label={p.name} color="#ef4444" status="attempt" />)}
                    {trappedPxs.length > 3 && <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>+{trappedPxs.length - 3} más (intentar rescatar)...</span>}
                  </div>
                </div>

                {/* Free WhatsApps */}
                <div style={{ flex: '1 1 200px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#25d366', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Smartphone size={15} /> WAs con historial — {freeWAs.length} libres
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {freeWAs.map((w, i) => <AssetPill key={i} icon={Smartphone} label={w.name || w.phone} color="#25d366" status="free" />)}
                  </div>
                </div>

                {/* Fan Pages */}
                <div style={{ flex: '1 1 200px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#3b82f6', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Globe size={15} /> Fan Pages — Todas compartidas aquí
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {pages.filter(p => profileBMs.some(b => b.id === p.bm_id)).slice(0, 5).map((p, i) => <AssetPill key={i} icon={Globe} label={p.name} color="#3b82f6" status="free" />)}
                    {pages.filter(p => profileBMs.some(b => b.id === p.bm_id)).length > 5 && <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>+{pages.filter(p => profileBMs.some(b => b.id === p.bm_id)).length - 5} más...</span>}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '12px', padding: '10px 14px', background: '#10b98110', borderRadius: '8px', fontSize: '12px', color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={14} /> Verificar con LLC + dominio propio → Acceso a WhatsApp Business API
              </div>
            </Section>

            {/* Split into two branches */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '120px', marginTop: '0' }}>
              {/* Left branch: Share pixel to Guerreros */}
              <FlowArrow color="#06b6d4" label="⚡ Comparte Pixel →" />
              {/* Right branch: Separate Hub */}
              <FlowArrow color="#25d366" label="📱 Hub separado →" />
            </div>

            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              {/* LEFT: GUERREROS */}
              <div style={{ flex: '1 1 400px' }}>
                <Section color="#06b6d4" icon={Megaphone} title={`⚔️ GUERREROS — Pauta Activa (${guerreroBMs.length})`}
                  subtitle="Reciben pixel de la Bóveda. Si uno cae, se activa una Reserva. Tarjeta NUEVA en cada uno.">
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {guerreroBMs.map(bm => {
                      const debt = getBMDebt(bm, ads);
                      const active = getBMActiveAds(bm, ads);
                      const bmWAs = getWAs(bm.id);
                      const bmPxs = getPxs(bm.id);
                      const bmPgs = getPgs(bm.id);
                      return (
                        <BMCard key={bm.id} name={bm.name} color="#06b6d4"
                          role={`Guerrero #${guerreroBMs.indexOf(bm) + 1}`}
                          debt={debt} activeAds={active} wasCount={bmWAs.length} pxCount={bmPxs.length} pgCount={bmPgs.length}
                          badge={bmPxs.length > 0 ? { text: 'Pixel ✓', color: '#22c55e' } : { text: 'Necesita Pixel', color: '#f59e0b' }}
                        />
                      );
                    })}
                  </div>
                </Section>
              </div>

              {/* RIGHT: HUB CHATIFY */}
              <div style={{ flex: '1 1 280px', maxWidth: '340px' }}>
                <Section color="#25d366" icon={MessageCircle} title="📱 HUB CHATIFY — chileshop.co" dashed
                  subtitle={<>BM separado para números de Chatify. Si se banea, <strong style={{color:'#ef4444'}}>la Bóveda NO se afecta</strong>.</>}>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                      <Lock size={13} color="#25d366" /> <strong>Verificar con LLC</strong>
                    </div>
                    <div>• WA nuevo #1 → shopyeasy.shop/comprasya</div>
                    <div>• WA nuevo #2 → shopyeasy.shop/guateshop</div>
                    <div>• WA nuevo #3 → shopyeasy.shop/argenshop</div>
                    <div>• WA nuevo #N → tienda nueva</div>
                  </div>
                  <div style={{ marginTop: '10px', padding: '8px 12px', background: '#25d36610', borderRadius: '6px', fontSize: '11px', color: '#25d366', fontWeight: 600 }}>
                    ♻️ Si cae → usar otra Reserva como nuevo Hub
                  </div>
                </Section>
              </div>
            </div>

            {/* RESERVAS */}
            <FlowArrow color="#8b5cf6" label="Activar cuando caiga un Guerrero o Hub" dashed />
            <Section color="#8b5cf6" icon={Package} title={`📦 RESERVAS — En Banca (${reservaBMs.length})`}
              subtitle="Cada uno tiene su Fan Page de país lista. Se activa compartiendo pixel de la Bóveda + tarjeta nueva.">
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {reservaBMs.map(bm => {
                  const bmPgs = getPgs(bm.id);
                  const bmWAs = getWAs(bm.id);
                  return (
                    <BMCard key={bm.id} name={bm.name} color="#8b5cf6"
                      pgCount={bmPgs.length} wasCount={bmWAs.length}
                    />
                  );
                })}
              </div>
            </Section>

            {/* CEMENTERIO */}
            <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0' }}>
              <div style={{ background: 'repeating-linear-gradient(45deg, #ef444415, #ef444415 10px, transparent 10px, transparent 20px)', height: '3px', width: '300px' }} />
            </div>
            <Section color="#ef4444" icon={Skull} title={`☠️ CEMENTERIO — AISLADO (${cementerioBMs.length})`} hazard
              subtitle={<><strong>Fase 1:</strong> Extraer WAs y Pixels (compartir como socio). <strong>Fase 2:</strong> Quitar tarjetas y congelar. NUNCA verificar con LLC.</>}>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {cementerioBMs.map(bm => {
                  const debt = getBMDebt(bm, ads);
                  const active = getBMActiveAds(bm, ads);
                  const bmWAs = getWAs(bm.id).filter(w => !(w.name || '').includes('Test'));
                  const bmPxs = getPxs(bm.id);
                  return (
                    <BMCard key={bm.id} name={bm.name} color="#ef4444"
                      debt={debt} activeAds={active} wasCount={bmWAs.length} pxCount={bmPxs.length}
                      badge={{ text: `$${(debt/1000000).toFixed(1)}M`, color: '#ef4444' }}
                    >
                      {bmWAs.length > 0 && (
                        <div style={{ marginTop: '6px', fontSize: '11px', color: '#f59e0b', fontWeight: 600 }}>
                          ⚠️ {bmWAs.length} WA atrapados — intentar rescatar
                        </div>
                      )}
                    </BMCard>
                  );
                })}
              </div>

              {/* Trapped assets summary */}
              <div style={{ marginTop: '14px', padding: '10px 14px', background: '#ef444410', borderRadius: '8px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#ef4444', marginBottom: '6px' }}>
                  ⛓️ Activos atrapados ({trappedWAs.length} WAs + {trappedPxs.length} Pixels)
                </div>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {trappedWAs.slice(0, 6).map((w, i) => <AssetPill key={i} icon={Smartphone} label={w.name || w.phone} color="#ef4444" status="trapped" />)}
                  {trappedWAs.length > 6 && <span style={{ fontSize: '11px', color: '#ef4444', alignSelf: 'center' }}>+{trappedWAs.length - 6} más</span>}
                </div>
              </div>
            </Section>
          </div>
        ) : (
          /* ═══ OTHER PROFILES — Coming Soon ═══ */
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏗️</div>
            <h3 style={{ color: current.color, fontSize: '22px', margin: '0 0 8px 0' }}>Contingencia de {current.name}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', maxWidth: '400px', margin: '0 auto' }}>
              La estructura de contingencia para este perfil se diseñará después de aprobar y ejecutar la de Paula Rojas.
            </p>
            <div style={{ marginTop: '20px', fontSize: '14px', color: 'var(--text-tertiary)' }}>
              {profileBMs.length} BMs | {was.filter(w => profileBMs.some(b => b.id === w.bm_id)).length} WAs | {pxs.filter(p => profileBMs.some(b => b.id === p.bm_id)).length} Pixels
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IdealArchitecture;
