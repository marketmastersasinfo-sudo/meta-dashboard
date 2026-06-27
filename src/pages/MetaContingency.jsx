import React from 'react';
import { ShieldCheck, MessageCircle, Share2, Instagram, CreditCard } from 'lucide-react';

const MetaContingency = () => {
  return (
    <div>
      <h1 className="page-title">Contingencia Meta (Facebook & IG)</h1>
      <p className="page-subtitle">Semáforos de salud de tus activos en Meta y WhatsApp Cloud API</p>

      <div className="dashboard-grid">
        {/* Cuentas Publicitarias */}
        <div className="glass-card">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Share2 className="text-accent-primary" />
            Cuentas Publicitarias (CP)
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg-primary)', borderRadius: '8px' }}>
              <div>
                <div style={{ fontWeight: '500' }}>CP - Ecom Principal</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>ID: 10023485729</div>
              </div>
              <div className="badge badge-success">Activa</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg-primary)', borderRadius: '8px' }}>
              <div>
                <div style={{ fontWeight: '500' }}>CP - Respaldo 1</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>ID: 9988273645</div>
              </div>
              <div className="badge badge-warning">Revisión</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg-primary)', borderRadius: '8px' }}>
              <div>
                <div style={{ fontWeight: '500' }}>CP - Testeo</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>ID: 5566443322</div>
              </div>
              <div className="badge badge-danger">Bloqueada</div>
            </div>
          </div>
        </div>

        {/* WhatsApp Cloud API */}
        <div className="glass-card">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <MessageCircle className="text-success" />
            WhatsApp Cloud API
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg-primary)', borderRadius: '8px' }}>
              <div>
                <div style={{ fontWeight: '500' }}>Línea Ventas 1</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>+57 300 123 4567</div>
              </div>
              <div className="badge badge-success">Conectado</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg-primary)', borderRadius: '8px' }}>
              <div>
                <div style={{ fontWeight: '500' }}>Línea Soporte</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>+57 311 987 6543</div>
              </div>
              <div className="badge badge-success">Conectado</div>
            </div>
          </div>
        </div>

        {/* Tarjetas Dropicard */}
        <div className="glass-card">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <CreditCard className="text-warning" />
            Tarjetas Dropicard
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg-primary)', borderRadius: '8px' }}>
              <div>
                <div style={{ fontWeight: '500' }}>Virtual 01 (CP Principal)</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>**** 4567 • Gasto: $150</div>
              </div>
              <div className="badge badge-success">OK</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg-primary)', borderRadius: '8px' }}>
              <div>
                <div style={{ fontWeight: '500' }}>Virtual 02 (CP Testeo)</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>**** 8901 • Gasto: $0</div>
              </div>
              <div className="badge badge-danger">Descartar</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MetaContingency;
