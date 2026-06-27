import React, { useEffect, useState } from 'react';
import { Network, Server, User, Globe, AlertTriangle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Dashboard = () => {
  const [bms, setBms] = useState({ backup: null, rooms: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBMs();
  }, []);

  const fetchBMs = async () => {
    try {
      const { data, error } = await supabase
        .from('business_managers')
        .select('*');
      
      if (error) throw error;

      const backup = data.find(bm => bm.type === 'BACKUP');
      const rooms = data.filter(bm => bm.type === 'ROOM');

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

  const getStatusBadge = (status, text) => {
    if (status === 'ACTIVE') return <div className="badge badge-success" style={{ marginBottom: '8px' }}>{text}</div>;
    if (status === 'WARNING') return <div className="badge badge-warning" style={{ marginBottom: '8px' }}>{text} (Alerta)</div>;
    return <div className="badge badge-danger" style={{ marginBottom: '8px' }}>{text} (Bloqueado)</div>;
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Loader2 className="animate-spin text-accent-primary" size={48} />
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title">Mapa de Estructura Publicitaria</h1>
      <p className="page-subtitle">Visualización global de tu red de contingencia extraída de Supabase</p>

      <div className="glass-card" style={{ marginBottom: '24px' }}>
        <h2 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Network className="text-accent-primary" />
          Ecosistema "Marlin"
        </h2>
        <div style={{ padding: '20px', background: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          
          {bms.backup && (
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
              <div className="glass-card" style={{ textAlign: 'center', border: '2px solid var(--success)', width: '250px' }}>
                <div className="badge badge-success" style={{ marginBottom: '8px' }}>LA BÓVEDA</div>
                <h3 style={{ fontSize: '18px', color: 'var(--text-primary)' }}>{bms.backup.name}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>Dominios, Píxeles, Fanpages</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '12px' }}>
                  <span className="badge" style={{ background: 'var(--bg-tertiary)' }}><User size={12}/> Admin 1</span>
                  <span className="badge" style={{ background: 'var(--bg-tertiary)' }}><User size={12}/> Admin 2</span>
                </div>
              </div>
            </div>
          )}
          
          <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '20px' }}>
            {bms.rooms.map((room, idx) => (
              <div key={room.id} className="glass-card" style={{ textAlign: 'center', border: `1px solid ${getStatusColor(room.status)}`, width: '220px' }}>
                {getStatusBadge(room.status, `ROOM ${idx + 1}`)}
                <h3 style={{ fontSize: '16px', color: 'var(--text-primary)' }}>{room.name}</h3>
                <div style={{ marginTop: '12px', textAlign: 'left', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  <div><Globe size={12}/> Proxy: {room.proxy_country}</div>
                  <div><Server size={12}/> Conectado al Backup</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
