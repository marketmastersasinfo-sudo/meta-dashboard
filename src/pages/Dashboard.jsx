import React from 'react';
import { Network, Server, User, Globe, AlertTriangle } from 'lucide-react';

const Dashboard = () => {
  return (
    <div>
      <h1 className="page-title">Mapa de Estructura Publicitaria</h1>
      <p className="page-subtitle">Visualización global de tu red de contingencia (BMs, Proxies, Perfiles)</p>

      <div className="glass-card" style={{ marginBottom: '24px' }}>
        <h2 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Network className="text-accent-primary" />
          Ecosistema "Marlin"
        </h2>
        <div style={{ padding: '20px', background: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
            <div className="glass-card" style={{ textAlign: 'center', border: '2px solid var(--success)', width: '250px' }}>
              <div className="badge badge-success" style={{ marginBottom: '8px' }}>LA BÓVEDA</div>
              <h3 style={{ fontSize: '18px', color: 'var(--text-primary)' }}>BM Backup (Matriz)</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>Dominios, Píxeles, Fanpages</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '12px' }}>
                <span className="badge" style={{ background: 'var(--bg-tertiary)' }}><User size={12}/> Perfil 1</span>
                <span className="badge" style={{ background: 'var(--bg-tertiary)' }}><User size={12}/> Perfil 2</span>
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '20px' }}>
            {/* Room 1 */}
            <div className="glass-card" style={{ textAlign: 'center', border: '1px solid var(--accent-primary)', width: '220px' }}>
              <div className="badge" style={{ background: 'rgba(59, 130, 246, 0.2)', color: 'var(--accent-primary)', marginBottom: '8px' }}>ROOM 1</div>
              <h3 style={{ fontSize: '16px', color: 'var(--text-primary)' }}>BM Anunciante A</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>Gasto: $1,200</p>
              <div style={{ marginTop: '12px', textAlign: 'left', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <div><Globe size={12}/> Proxy: US-East</div>
                <div><Server size={12}/> Tarjeta: Dropicard-01</div>
              </div>
            </div>
            
            {/* Room 2 */}
            <div className="glass-card" style={{ textAlign: 'center', border: '1px solid var(--warning)', width: '220px' }}>
              <div className="badge badge-warning" style={{ marginBottom: '8px' }}>ROOM 2 (Alerta)</div>
              <h3 style={{ fontSize: '16px', color: 'var(--text-primary)' }}>BM Anunciante B</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>Gasto: $450</p>
              <div style={{ marginTop: '12px', textAlign: 'left', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <div><Globe size={12}/> Proxy: CO-Bog</div>
                <div><Server size={12}/> Tarjeta: Dropicard-02</div>
              </div>
            </div>

            {/* Room 3 */}
            <div className="glass-card" style={{ textAlign: 'center', border: '1px solid var(--danger)', width: '220px' }}>
              <div className="badge badge-danger" style={{ marginBottom: '8px' }}>ROOM 3 (Bloqueado)</div>
              <h3 style={{ fontSize: '16px', color: 'var(--text-primary)' }}>BM Anunciante C</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>Gasto: $0</p>
              <div style={{ marginTop: '12px', textAlign: 'left', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <div><Globe size={12}/> Proxy: MX-Cdmx</div>
                <div><AlertTriangle size={12} className="text-danger"/> Tarjeta: Bloqueada</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
