import React, { useEffect, useState } from 'react';
import { Network, Server, Maximize2, UserCircle, Loader2, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import BMDetailsModal from '../components/BMDetailsModal';

const Dashboard = () => {
  const [allBMs, setAllBMs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBM, setSelectedBM] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  
  // Perfiles de Facebook
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState('');

  useEffect(() => {
    fetchBMs();
  }, []);

  const fetchBMs = async () => {
    try {
      setFetchError(null);
      // 1. Fetch BMs
      const { data: bmData, error: bmError } = await supabase.from('business_managers').select('*');
      if (bmError) throw bmError;

      // 2. Fetch all related assets safely (in case tables don't exist yet, we catch errors)
      const fetchSafe = async (table) => {
        const { data, error } = await supabase.from(table).select('*').catch((e) => ({ data: [], error: e }));
        return error ? [] : (data || []);
      };

      const [adAccounts, pages, instagrams, pixels, whatsapps] = await Promise.all([
        fetchSafe('ad_accounts'),
        fetchSafe('pages'),
        fetchSafe('instagram_accounts'),
        fetchSafe('pixels'),
        fetchSafe('whatsapp_lines')
      ]);

      // 3. Assemble the data
      const enrichedBMs = bmData.map(bm => ({
        ...bm,
        adAccounts: adAccounts.filter(cp => cp.bm_id === bm.id),
        pages: pages.filter(p => p.bm_id === bm.id),
        instagrams: instagrams.filter(ig => ig.bm_id === bm.id),
        pixels: pixels.filter(px => px.bm_id === bm.id),
        whatsapps: whatsapps.filter(wa => wa.bm_id === bm.id)
      }));

      enrichedBMs.sort((a, b) => a.name.localeCompare(b.name));
      setAllBMs(enrichedBMs);

      // Extract unique profiles
      const uniqueProfiles = [...new Set(enrichedBMs.map(bm => bm.facebook_profile || bm.proxy_country || 'Paula Rojas'))];
      setProfiles(uniqueProfiles);
      if (uniqueProfiles.length > 0) {
        setSelectedProfile(uniqueProfiles[0]);
      }

    } catch (error) {
      console.error('Error fetching BMs:', error);
      setFetchError(error.message || JSON.stringify(error));
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    if (status === 'ACTIVE') return 'var(--success)';
    if (status === 'WARNING') return 'var(--warning)';
    return 'var(--danger)';
  };

  const openBMDetails = (bm) => {
    setSelectedBM(bm);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Loader2 className="animate-spin text-accent-primary" size={48} />
      </div>
    );
  }

  if (fetchError) {
    return (
      <div style={{ padding: '24px', background: 'var(--danger)', color: 'white', borderRadius: '12px', margin: '24px' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><AlertTriangle /> Error Crítico de Conexión</h2>
        <p style={{ marginTop: '12px', fontFamily: 'monospace', background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px' }}>
          {fetchError}
        </p>
        <p style={{ marginTop: '12px' }}>Por favor envíame una captura de esta pantalla roja para que pueda arreglarlo inmediatamente.</p>
      </div>
    );
  }

  // Filtrar BMs por el perfil seleccionado
  const filteredBMs = allBMs.filter(bm => (bm.facebook_profile || bm.proxy_country || 'Paula Rojas') === selectedProfile);
  const backup = filteredBMs.filter(bm => bm.type === 'BACKUP');
  const rooms = filteredBMs.filter(bm => bm.type === 'ROOM');

  return (
    <div className="fade-in">
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 className="page-title">Estructura Publicitaria</h1>
          <p className="page-subtitle">Visualización interactiva (Haz clic en un BM para ver su inventario)</p>
        </div>
        
        {/* Selector de Perfil */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--glass-bg)', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
          <UserCircle size={20} className="text-accent-primary" />
          <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)' }}>Perfil Visualizado:</span>
          <select 
            className="profile-select"
            value={selectedProfile} 
            onChange={(e) => setSelectedProfile(e.target.value)}
          >
            {profiles.length > 0 ? profiles.map(prof => (
              <option key={prof} value={prof}>{prof}</option>
            )) : <option value="">Sin Perfiles</option>}
          </select>
        </div>
      </div>

      {/* Backups / Bóvedas */}
      <div style={{ marginBottom: '48px' }}>
        <h2 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
          <Network className="text-accent-primary" />
          Bóvedas (Backups Oficiales)
        </h2>
        <div className="grid-bms">
          {backup.map((bm, idx) => (
            <div key={bm.id} className="glass-card bm-card" onClick={() => openBMDetails(bm)} style={{ borderTop: `4px solid ${getStatusColor(bm.status)}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span className="badge badge-success" style={{ marginBottom: '16px' }}>BÓVEDA PRINCIPAL</span>
                <Maximize2 size={16} color="var(--text-muted)" />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>{bm.name}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', display: 'flex', justifyContent: 'space-between' }}>
                <span>Cuentas: {bm.adAccounts?.length || 0}</span>
                <span>Activos Adicionales: {(bm.pages?.length || 0) + (bm.instagrams?.length || 0) + (bm.pixels?.length || 0) + (bm.whatsapps?.length || 0)}</span>
              </p>
            </div>
          ))}
          {backup.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No hay Bóvedas asignadas a este perfil.</p>}
        </div>
      </div>

      {/* Rooms / Anunciantes */}
      <div>
        <h2 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
          <Server className="text-accent-primary" />
          Rooms (BMs Anunciantes)
        </h2>
        <div className="grid-bms">
          {rooms.map((bm, idx) => (
            <div key={bm.id} className="glass-card bm-card" onClick={() => openBMDetails(bm)} style={{ borderTop: `4px solid ${getStatusColor(bm.status)}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span className={`badge badge-${bm.status === 'ACTIVE' ? 'success' : bm.status === 'WARNING' ? 'warning' : 'danger'}`} style={{ marginBottom: '16px' }}>
                  {bm.status}
                </span>
                <Maximize2 size={16} color="var(--text-muted)" />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '12px' }}>{bm.name}</h3>
              
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-color)', marginBottom: '8px' }}>
                  <span>Cuentas Publicitarias:</span>
                  <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{bm.adAccounts?.length || 0}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Activos Adicionales:</span>
                  <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{(bm.pages?.length || 0) + (bm.instagrams?.length || 0) + (bm.pixels?.length || 0) + (bm.whatsapps?.length || 0)}</span>
                </div>
              </div>
            </div>
          ))}
          {rooms.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No hay Rooms asignados a este perfil.</p>}
        </div>
      </div>

      {/* Modal / Drawer */}
      <BMDetailsModal bm={selectedBM} onClose={() => setSelectedBM(null)} />
    </div>
  );
};

export default Dashboard;
