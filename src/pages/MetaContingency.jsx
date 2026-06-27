import React, { useEffect, useState } from 'react';
import { ShieldCheck, MessageCircle, Share2, CreditCard, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

const MetaContingency = () => {
  const [adAccounts, setAdAccounts] = useState([]);
  const [cards, setCards] = useState([]);
  const [whatsappLines, setWhatsappLines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [adRes, cardRes, waRes] = await Promise.all([
        supabase.from('ad_accounts').select('*'),
        supabase.from('cards').select('*'),
        supabase.from('whatsapp_lines').select('*')
      ]);

      if (adRes.error) throw adRes.error;
      if (cardRes.error) throw cardRes.error;
      if (waRes.error) throw waRes.error;

      setAdAccounts(adRes.data);
      setCards(cardRes.data);
      setWhatsappLines(waRes.data);
    } catch (error) {
      console.error('Error fetching Meta data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    if (status === 'ACTIVE' || status === 'CONNECTED') return 'var(--success)';
    if (status === 'WARNING') return 'var(--warning)';
    return 'var(--danger)';
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
      <h1 className="page-title">Contingencia Meta (Facebook/IG)</h1>
      <p className="page-subtitle">Estado en tiempo real de tus perfiles y activos de Meta desde Supabase.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        
        {/* Cuentas Publicitarias */}
        <div className="glass-card">
          <h2 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Share2 className="text-accent-primary" />
            Cuentas Publicitarias
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {adAccounts.map(cp => (
              <div key={cp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
                <div>
                  <h4 style={{ color: 'var(--text-primary)' }}>{cp.name}</h4>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>ID: {cp.meta_account_id}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: getStatusColor(cp.status), fontWeight: 'bold', fontSize: '14px' }}>
                    {cp.status === 'ACTIVE' ? 'ACTIVA' : cp.status}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Gasto: ${cp.total_spend}</div>
                </div>
              </div>
            ))}
            {adAccounts.length === 0 && <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>No hay cuentas registradas.</p>}
          </div>
        </div>

        {/* Tarjetas Dropicard */}
        <div className="glass-card">
          <h2 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CreditCard className="text-accent-primary" />
            Tarjetas de Pago (Dropicard)
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {cards.map(card => (
              <div key={card.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
                <div>
                  <h4 style={{ color: 'var(--text-primary)' }}>{card.name}</h4>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Termina en **{card.mask}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: getStatusColor(card.status), fontWeight: 'bold', fontSize: '14px' }}>{card.status}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Consumo: ${card.spent}</div>
                </div>
              </div>
            ))}
            {cards.length === 0 && <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>No hay tarjetas registradas.</p>}
          </div>
        </div>

        {/* WhatsApp */}
        <div className="glass-card">
          <h2 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageCircle className="text-accent-primary" />
            Líneas de WhatsApp
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {whatsappLines.map(wa => (
              <div key={wa.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
                <div>
                  <h4 style={{ color: 'var(--text-primary)' }}>{wa.name}</h4>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{wa.phone}</span>
                </div>
                <div style={{ color: getStatusColor(wa.status), fontWeight: 'bold', fontSize: '14px' }}>
                  {wa.status === 'CONNECTED' ? 'CONECTADO' : wa.status}
                </div>
              </div>
            ))}
            {whatsappLines.length === 0 && <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>No hay líneas registradas.</p>}
          </div>
        </div>

      </div>
    </div>
  );
};

export default MetaContingency;
