import React, { useEffect, useState } from 'react';
import { Network, Server, User, Globe, Loader2, Maximize2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import BMDetailsModal from '../components/BMDetailsModal';

const Dashboard = () => {
  const [bms, setBms] = useState({ backup: [], rooms: [] });
  const [loading, setLoading] = useState(true);
  const [selectedBM, setSelectedBM] = useState(null);

  useEffect(() => {
    fetchBMs();
  }, []);

  const fetchBMs = async () => {
    try {
      // 1. Fetch BMs
      const { data: bmData, error: bmError } = await supabase.from('business_managers').select('*');
      if (bmError) throw bmError;

      // 2. Fetch all related assets safely (in case tables don't exist yet, we catch errors)
      const fetchSafe = async (table) => {
        const { data, error } = await supabase.from(table).select('*').catch(() => ({ data: [] }));
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

      // Sort by status to show WARNING/BANNED first? Or keep them alphabetical
      enrichedBMs.sort((a, b) => a.name.localeCompare(b.name));

      const backup = enrichedBMs.filter(bm => bm.type === 'BACKUP');
      const rooms = enrichedBMs.filter(bm => bm.type === 'ROOM');

      setBms({ backup, rooms });
    } catch (error) {
      console.error('Error fetching BMs:', error);
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

  return (
    <div className="fade-in">
      <h1 className="page-title">Mapa de Estructura Publicitaria</h1>
      <p className="page-subtitle">Visualización global de tu red de contingencia (Haz clic en cualquier BM para ver sus activos)</p>

      {/* Backups / Bóvedas */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
          <Network className="text-accent-primary" />
          Las Bóvedas (Backups)
        </h2>
        <div className="grid-bms">
          {bms.backup.map((bm, idx) => (
            <div key={bm.id} className="glass-card bm-card" onClick={() => openBMDetails(bm)} style={{ borderTop: `4px solid ${getStatusColor(bm.status)}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span className="badge badge-success" style={{ marginBottom: '12px' }}>BÓVEDA</span>
                <Maximize2 size={16} color="var(--text-muted)" />
              </div>
              <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '8px' }}>{bm.name}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', display: 'flex', justifyContent: 'space-between' }}>
                <span>Cuentas: {bm.adAccounts?.length || 0}</span>
                <span>Páginas: {bm.pages?.length || 0}</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Rooms / Anunciantes */}
      <div>
        <h2 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
          <Server className="text-accent-primary" />
          Rooms (BMs Anunciantes)
        </h2>
        <div className="grid-bms">
          {bms.rooms.map((bm, idx) => (
            <div key={bm.id} className="glass-card bm-card" onClick={() => openBMDetails(bm)} style={{ borderTop: `4px solid ${getStatusColor(bm.status)}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span className={`badge badge-${bm.status === 'ACTIVE' ? 'success' : bm.status === 'WARNING' ? 'warning' : 'danger'}`} style={{ marginBottom: '12px' }}>
                  {bm.status}
                </span>
                <Maximize2 size={16} color="var(--text-muted)" />
              </div>
              <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '8px' }}>{bm.name}</h3>
              
              <div style={{ marginTop: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>Cuentas Publicitarias:</span>
                  <span style={{ fontWeight: '600' }}>{bm.adAccounts?.length || 0}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Activos Conectados:</span>
                  <span style={{ fontWeight: '600' }}>{(bm.pages?.length || 0) + (bm.instagrams?.length || 0) + (bm.pixels?.length || 0)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal / Drawer */}
      <BMDetailsModal bm={selectedBM} onClose={() => setSelectedBM(null)} />
    </div>
  );
};

export default Dashboard;
