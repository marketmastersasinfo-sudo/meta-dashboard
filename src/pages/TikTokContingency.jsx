import React from 'react';
import { Activity, Briefcase, DollarSign } from 'lucide-react';

const TikTokContingency = () => {
  return (
    <div>
      <h1 className="page-title">Contingencia TikTok Ads</h1>
      <p className="page-subtitle">Monitoreo de Business Center y control de saldos</p>

      <div className="dashboard-grid">
        {/* Business Center Status */}
        <div className="glass-card" style={{ gridColumn: '1 / -1' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
            <Briefcase className="text-accent-primary" />
            Estructura Business Center Principal
          </h3>
          
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            
            <div style={{ flex: 1, minWidth: '300px', background: 'var(--bg-primary)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h4 style={{ fontSize: '18px' }}>Ad Account 1 (Activa)</h4>
                <div className="badge badge-success">OK</div>
              </div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', color: 'var(--success)' }}>$ 350.00</div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Saldo Disponible</div>
              <button style={{ marginTop: '16px', width: '100%', padding: '8px', borderRadius: '6px', background: 'var(--bg-tertiary)', color: 'white', border: 'none', cursor: 'pointer' }}>
                Transferir Saldo
              </button>
            </div>

            <div style={{ flex: 1, minWidth: '300px', background: 'var(--bg-primary)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h4 style={{ fontSize: '18px' }}>Ad Account 2 (Baneada)</h4>
                <div className="badge badge-danger">Suspendida</div>
              </div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', color: 'var(--danger)' }}>$ 120.00</div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Saldo Atrapado</div>
              <button style={{ marginTop: '16px', width: '100%', padding: '8px', borderRadius: '6px', background: 'var(--accent-primary)', color: 'white', border: 'none', cursor: 'pointer' }}>
                Recuperar al Business Center
              </button>
            </div>

            <div style={{ flex: 1, minWidth: '300px', background: 'var(--bg-primary)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h4 style={{ fontSize: '18px' }}>Ad Account 3 (Respaldo)</h4>
                <div className="badge badge-warning">En Calentamiento</div>
              </div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', color: 'var(--text-secondary)' }}>$ 0.00</div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Lista para fondear</div>
              <button style={{ marginTop: '16px', width: '100%', padding: '8px', borderRadius: '6px', background: 'var(--bg-tertiary)', color: 'white', border: 'none', cursor: 'pointer' }}>
                Fondear desde BC
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default TikTokContingency;
