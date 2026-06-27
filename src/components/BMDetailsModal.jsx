import React from 'react';
import { X, Share2, CreditCard, Layers, Hash, MessageCircle } from 'lucide-react';

const formatCurrency = (amount) => {
  // Convierte el número a string y le pone puntos como separadores de miles
  return '$' + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const BMDetailsModal = ({ bm, onClose }) => {
  if (!bm) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-drawer" onClick={e => e.stopPropagation()}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)' }}>{bm.name}</h2>
            <p style={{ color: 'var(--text-secondary)' }}>ID: {bm.id}</p>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={24} />
          </button>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
          <span className={`badge badge-${bm.status === 'ACTIVE' ? 'success' : bm.status === 'WARNING' ? 'warning' : 'danger'}`}>
            ESTADO: {bm.status}
          </span>
          <span className="badge" style={{ background: 'var(--bg-tertiary)' }}>
            ROL: {bm.type}
          </span>
        </div>

        {/* Cuentas Publicitarias */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: 'var(--text-primary)' }}>
            <Share2 size={18} className="text-accent-primary" />
            Cuentas Publicitarias
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {bm.adAccounts && bm.adAccounts.length > 0 ? bm.adAccounts.map(cp => (
              <div key={cp.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div>
                  <h4 style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{cp.name}</h4>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    {cp.card_mask ? <span style={{display:'flex', alignItems:'center', gap:'4px'}}><CreditCard size={12}/> **{cp.card_mask}</span> : 'Sin Tarjeta'}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: cp.status === 'ACTIVE' ? 'var(--success)' : 'var(--danger)', fontWeight: 'bold', fontSize: '13px' }}>
                    {cp.status}
                  </div>
                  {cp.ban_reason && cp.status !== 'ACTIVE' && (
                    <div style={{ fontSize: '11px', color: 'var(--danger)', marginTop: '2px' }}>
                      ({cp.ban_reason})
                    </div>
                  )}
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Saldo: {formatCurrency(cp.current_balance || 0)}
                  </div>
                </div>
              </div>
            )) : <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No hay cuentas publicitarias asociadas.</p>}
          </div>
        </div>

        {/* Fanpages */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: 'var(--text-primary)' }}>
            <Layers size={18} className="text-accent-primary" />
            Fan Pages
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {bm.pages && bm.pages.length > 0 ? bm.pages.map(page => (
              <span key={page.id} className="badge" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                {page.name}
              </span>
            )) : <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No hay páginas registradas en la DB para este BM.</p>}
          </div>
        </div>

        {/* Instagrams */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: 'var(--text-primary)' }}>
            <Hash size={18} className="text-accent-primary" />
            Cuentas de Instagram
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {bm.instagrams && bm.instagrams.length > 0 ? bm.instagrams.map(ig => (
              <span key={ig.id} className="badge" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                @{ig.handle}
              </span>
            )) : <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No hay Instagrams registrados.</p>}
          </div>
        </div>

        {/* Pixels */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: 'var(--text-primary)' }}>
            <Hash size={18} className="text-accent-primary" />
            Píxeles
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {bm.pixels && bm.pixels.length > 0 ? bm.pixels.map(pixel => (
              <span key={pixel.id} className="badge" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                {pixel.name}
              </span>
            )) : <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No hay píxeles registrados.</p>}
          </div>
        </div>
        
        {/* WhatsApp Lines */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: 'var(--text-primary)' }}>
            <MessageCircle size={18} className="text-accent-primary" />
            Líneas de WhatsApp
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {bm.whatsapps && bm.whatsapps.length > 0 ? bm.whatsapps.map(wa => (
              <div key={wa.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div>
                  <h4 style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{wa.name}</h4>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    {wa.card_mask ? <span style={{display:'flex', alignItems:'center', gap:'4px'}}><CreditCard size={12}/> **{wa.card_mask}</span> : 'Sin Tarjeta'}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: wa.status === 'ACTIVE' ? 'var(--success)' : 'var(--danger)', fontWeight: 'bold', fontSize: '13px' }}>
                    {wa.status}
                  </div>
                </div>
              </div>
            )) : <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No hay líneas de WhatsApp registradas.</p>}
          </div>
        </div>

      </div>
    </div>
  );
};

export default BMDetailsModal;
