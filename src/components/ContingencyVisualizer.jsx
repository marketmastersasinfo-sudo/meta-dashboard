import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ShieldAlert, ShieldCheck, Shield, AlertTriangle, AlertCircle, Smartphone, CreditCard, Box, Share2, Eye, Loader2 } from 'lucide-react';

const ContingencyVisualizer = () => {
  const [data, setData] = useState({ bms: [], ads: [], pages: [], was: [], pxs: [] });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // ALL, RED, THREADS

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [bmsRes, adsRes, pagesRes, wasRes, pxsRes] = await Promise.all([
        supabase.from('business_managers').select('*'),
        supabase.from('ad_accounts').select('*'),
        supabase.from('pages').select('*'),
        supabase.from('whatsapp_lines').select('*'),
        supabase.from('pixels').select('*')
      ]);

      setData({
        bms: bmsRes.data || [],
        ads: adsRes.data || [],
        pages: pagesRes.data || [],
        was: wasRes.data || [],
        pxs: pxsRes.data || []
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto text-accent-primary" size={48} /></div>;

  // Algoritmo de clasificación
  const getBMZone = (bm) => {
    const bmAds = data.ads.filter(a => a.bm_id === bm.id);
    const activeAds = bmAds.filter(a => a.status === 'ACTIVE');
    const bannedAds = bmAds.filter(a => a.status !== 'ACTIVE');
    const debt = bmAds.reduce((sum, a) => sum + (a.current_balance || 0), 0);

    if (debt > 1000000) return 'RED';
    if (bannedAds.length > activeAds.length && bmAds.length > 0) return 'RED';
    
    if (debt > 100000 || bannedAds.length > 0) return 'YELLOW';
    
    if (activeAds.length > 0 && debt === 0) return 'GREEN';
    if (bmAds.length === 0) return 'BLUE';
    
    return 'BLUE';
  };

  const profiles = ['Paula Rojas', 'Luz Angela', 'Gabriela Teguchi'];

  const getZoneColor = (zone) => {
    switch(zone) {
      case 'RED': return 'var(--danger)'; // tóxico
      case 'YELLOW': return 'var(--warning)'; // precaución
      case 'GREEN': return 'var(--success)'; // limpio
      case 'BLUE': return '#3b82f6'; // almacén
      default: return 'var(--text-secondary)';
    }
  };

  const getZoneBg = (zone) => {
    switch(zone) {
      case 'RED': return 'rgba(239, 68, 68, 0.1)';
      case 'YELLOW': return 'rgba(245, 158, 11, 0.1)';
      case 'GREEN': return 'rgba(16, 185, 129, 0.1)';
      case 'BLUE': return 'rgba(59, 130, 246, 0.1)';
      default: return 'var(--bg-primary)';
    }
  };

  const getZoneLabel = (zone) => {
    switch(zone) {
      case 'RED': return 'CUARENTENA';
      case 'YELLOW': return 'PRECAUCIÓN';
      case 'GREEN': return 'PAUTAR';
      case 'BLUE': return 'RESERVA/ALMACÉN';
      default: return '';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* Filters Toolbar */}
      <div className="glass-card" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <Eye className="text-accent-primary" />
        <span style={{ fontWeight: 'bold' }}>Vistas:</span>
        <button 
          onClick={() => setFilter('ALL')}
          style={{ background: filter === 'ALL' ? 'var(--accent-primary)' : 'var(--bg-primary)', color: filter === 'ALL' ? '#fff' : 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
        >
          Mapa Completo
        </button>
        <button 
          onClick={() => setFilter('RED')}
          style={{ background: filter === 'RED' ? 'var(--danger)' : 'var(--bg-primary)', color: filter === 'RED' ? '#fff' : 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
        >
          <AlertCircle size={14} style={{ display: 'inline', marginRight: '4px' }} />
          Ver Críticos (Rojo)
        </button>
        <button 
          onClick={() => setFilter('WAs')}
          style={{ background: filter === 'WAs' ? 'var(--success)' : 'var(--bg-primary)', color: filter === 'WAs' ? '#fff' : 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
        >
          <Smartphone size={14} style={{ display: 'inline', marginRight: '4px' }} />
          Rastrear WhatsApps
        </button>
      </div>

      {profiles.map(profile => {
        const profileBMs = data.bms.filter(b => b.facebook_profile === profile);
        if (profileBMs.length === 0) return null;

        return (
          <div key={profile} style={{ background: 'var(--bg-secondary)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', marginBottom: '20px' }}>
              <ShieldCheck className="text-accent-primary" />
              Perfil: {profile.toUpperCase()}
              <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 'normal' }}>
                ({profileBMs.length} BMs)
              </span>
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
              {profileBMs.map(bm => {
                const zone = getBMZone(bm);
                
                // Aplicar filtros
                if (filter === 'RED' && zone !== 'RED') return null;
                const bmWas = data.was.filter(w => w.bm_id === bm.id);
                if (filter === 'WAs' && bmWas.length === 0) return null;

                const bmAds = data.ads.filter(a => a.bm_id === bm.id);
                const debt = bmAds.reduce((sum, a) => sum + (a.current_balance || 0), 0);
                const banned = bmAds.filter(a => a.status !== 'ACTIVE').length;
                const active = bmAds.filter(a => a.status === 'ACTIVE').length;
                const pxs = data.pxs.filter(p => p.bm_id === bm.id);

                return (
                  <div key={bm.id} style={{ 
                    border: `1px solid ${getZoneColor(zone)}`,
                    borderRadius: '8px',
                    padding: '16px',
                    background: getZoneBg(zone),
                    position: 'relative'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--text-primary)' }}>{bm.name}</h3>
                      <span style={{ 
                        fontSize: '10px', 
                        fontWeight: 'bold', 
                        padding: '2px 6px', 
                        borderRadius: '12px',
                        background: getZoneColor(zone),
                        color: zone === 'YELLOW' ? '#000' : '#fff'
                      }}>
                        {getZoneLabel(zone)}
                      </span>
                    </div>

                    {/* Deuda / Cuentas */}
                    <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                      <div><strong style={{color: debt > 0 ? 'var(--danger)' : 'inherit'}}>Deuda:</strong> ${debt.toLocaleString()}</div>
                      <div><strong>Ads:</strong> {active}✅ {banned}❌</div>
                    </div>

                    {/* Activos Críticos (WAs y Pixeles) */}
                    {(bmWas.length > 0 || pxs.length > 0) && (
                      <div style={{ background: 'var(--bg-primary)', padding: '10px', borderRadius: '6px', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {bmWas.length > 0 && (
                          <div>
                            <strong style={{ display: 'flex', alignItems: 'center', gap: '4px', color: zone === 'RED' ? 'var(--danger)' : 'var(--success)' }}>
                              <Smartphone size={12} /> WhatsApps ({bmWas.length}) {zone === 'RED' && '⚠️ PELIGRO'}
                            </strong>
                            {bmWas.map(w => <div key={w.id} style={{ paddingLeft: '16px', color: 'var(--text-secondary)' }}>- {w.name}</div>)}
                          </div>
                        )}
                        
                        {pxs.length > 0 && (
                          <div style={{ marginTop: '4px' }}>
                            <strong style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-primary)' }}>
                              <Box size={12} /> Píxeles ({pxs.length})
                            </strong>
                            {pxs.map(p => <div key={p.id} style={{ paddingLeft: '16px', color: 'var(--text-secondary)' }}>- {p.name}</div>)}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Tarjetas Hilos (si hay baneadas) */}
                    {banned > 0 && (
                      <div style={{ marginTop: '10px', fontSize: '11px', color: 'var(--danger)' }}>
                        ⚠️ {banned} cuentas baneadas (Riesgo de BIN quemado)
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ContingencyVisualizer;
