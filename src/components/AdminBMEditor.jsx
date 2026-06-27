import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { X, Plus, Save, Trash2, Shield, CreditCard, FileText, Camera, MessageCircle, AlertCircle } from 'lucide-react';

const AdminBMEditor = ({ bm, onClose }) => {
  const [activeTab, setActiveTab] = useState('cuentas');
  
  // Data States
  const [adAccounts, setAdAccounts] = useState([]);
  const [whatsapps, setWhatsapps] = useState([]);
  const [pages, setPages] = useState([]);
  const [instagrams, setInstagrams] = useState([]);
  const [pixels, setPixels] = useState([]);

  // Load Data
  useEffect(() => {
    if (bm) {
      loadAssets();
    }
  }, [bm]);

  const loadAssets = async () => {
    const fetchTable = async (table) => {
      const { data } = await supabase.from(table).select('*').eq('bm_id', bm.id);
      return data || [];
    };

    setAdAccounts(await fetchTable('ad_accounts'));
    setWhatsapps(await fetchTable('whatsapp_lines'));
    setPages(await fetchTable('pages'));
    setInstagrams(await fetchTable('instagram_accounts'));
    setPixels(await fetchTable('pixels'));
  };

  // --- CRUD Cuentas Publicitarias ---
  const handleAddAdAccount = async () => {
    const name = prompt("Nombre de la nueva cuenta publicitaria:");
    if (!name) return;
    await supabase.from('ad_accounts').insert([{ bm_id: bm.id, name, status: 'ACTIVE', current_balance: 0 }]);
    loadAssets();
  };

  const handleUpdateAdAccount = async (id, field, value) => {
    await supabase.from('ad_accounts').update({ [field]: value }).eq('id', id);
    loadAssets();
  };

  const handleDeleteAdAccount = async (id) => {
    if (window.confirm("¿Eliminar esta cuenta?")) {
      await supabase.from('ad_accounts').delete().eq('id', id);
      loadAssets();
    }
  };

  // --- CRUD Activos Básicos (Pages, IG, Pixels) ---
  const handleAddBasicAsset = async (table, fieldName) => {
    const name = prompt(`Nombre para agregar a ${table}:`);
    if (!name) return;
    await supabase.from(table).insert([{ bm_id: bm.id, [fieldName]: name }]);
    loadAssets();
  };

  const handleDeleteBasicAsset = async (table, id) => {
    if (window.confirm("¿Eliminar este activo?")) {
      await supabase.from(table).delete().eq('id', id);
      loadAssets();
    }
  };

  // --- CRUD WhatsApp ---
  const handleAddWhatsApp = async () => {
    const name = prompt("Nombre de la línea de WhatsApp:");
    if (!name) return;
    await supabase.from('whatsapp_lines').insert([{ bm_id: bm.id, name, status: 'ACTIVE', phone: 'N/A' }]);
    loadAssets();
  };

  const handleUpdateWhatsApp = async (id, field, value) => {
    await supabase.from('whatsapp_lines').update({ [field]: value }).eq('id', id);
    loadAssets();
  };

  const handleDeleteWhatsApp = async (id) => {
    if (window.confirm("¿Eliminar este WhatsApp?")) {
      await supabase.from('whatsapp_lines').delete().eq('id', id);
      loadAssets();
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', zIndex: 1000, display: 'flex', justifyContent: 'flex-end' }}>
      <div style={{ width: '800px', maxWidth: '100%', height: '100%', backgroundColor: 'var(--bg-primary)', borderLeft: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', animation: 'slideInRight 0.3s ease-out' }}>
        
        {/* Header */}
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '8px' }}>
              Administrar: {bm.name}
            </h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span className="badge">{bm.type}</span>
              <span className={`badge badge-${bm.status === 'ACTIVE' ? 'success' : 'danger'}`}>{bm.status}</span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '8px' }}>
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', padding: '0 24px' }}>
          {[
            { id: 'cuentas', label: 'Cuentas Pub', icon: <CreditCard size={16} /> },
            { id: 'whatsapp', label: 'WhatsApp', icon: <MessageCircle size={16} /> },
            { id: 'pages', label: 'Páginas', icon: <FileText size={16} /> },
            { id: 'instagrams', label: 'Instagram', icon: <Camera size={16} /> },
            { id: 'pixels', label: 'Píxeles', icon: <AlertCircle size={16} /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '16px',
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid var(--accent-primary)' : '2px solid transparent',
                color: activeTab === tab.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                fontWeight: activeTab === tab.id ? 'bold' : 'normal',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          
          {/* Cuentas Publicitarias */}
          {activeTab === 'cuentas' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ color: 'var(--text-primary)' }}>Cuentas Publicitarias ({adAccounts.length})</h3>
                <button onClick={handleAddAdAccount} className="btn-outline" style={{ display: 'flex', gap: '4px', alignItems: 'center' }}><Plus size={16} /> Nueva Cuenta</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {adAccounts.map(acc => (
                  <div key={acc.id} style={{ padding: '16px', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <input 
                        type="text" 
                        value={acc.name} 
                        onChange={(e) => handleUpdateAdAccount(acc.id, 'name', e.target.value)}
                        style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontWeight: 'bold', padding: '4px 8px', borderRadius: '4px' }}
                      />
                      <button onClick={() => handleDeleteAdAccount(acc.id)} style={{ color: 'var(--danger)', background: 'transparent', border: 'none', cursor: 'pointer' }}><Trash2 size={16}/></button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Estado</label>
                        <select value={acc.status} onChange={(e) => handleUpdateAdAccount(acc.id, 'status', e.target.value)} style={{ width: '100%', padding: '4px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '4px' }}>
                          <option value="ACTIVE">ACTIVE</option>
                          <option value="BANNED">BANNED</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Motivo Baneo</label>
                        <input type="text" value={acc.ban_reason || ''} onChange={(e) => handleUpdateAdAccount(acc.id, 'ban_reason', e.target.value)} style={{ width: '100%', padding: '4px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '4px' }} placeholder="Opcional" />
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Tarjeta (Últimos 4)</label>
                        <input type="text" value={acc.card_mask || ''} onChange={(e) => handleUpdateAdAccount(acc.id, 'card_mask', e.target.value)} style={{ width: '100%', padding: '4px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '4px' }} placeholder="Ej: 5265" />
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Saldo (COP/USD)</label>
                        <input type="number" value={acc.current_balance || 0} onChange={(e) => handleUpdateAdAccount(acc.id, 'current_balance', parseInt(e.target.value))} style={{ width: '100%', padding: '4px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '4px' }} />
                      </div>
                    </div>
                  </div>
                ))}
                {adAccounts.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No hay cuentas publicitarias.</p>}
              </div>
            </div>
          )}

          {/* WhatsApp Lines */}
          {activeTab === 'whatsapp' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ color: 'var(--text-primary)' }}>Líneas de WhatsApp ({whatsapps.length})</h3>
                <button onClick={handleAddWhatsApp} className="btn-outline" style={{ display: 'flex', gap: '4px', alignItems: 'center' }}><Plus size={16} /> Nueva Línea</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {whatsapps.map(wa => (
                  <div key={wa.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '12px', alignItems: 'center', padding: '12px', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <input type="text" value={wa.name} onChange={(e) => handleUpdateWhatsApp(wa.id, 'name', e.target.value)} style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '4px 8px', borderRadius: '4px' }} />
                    <select value={wa.status} onChange={(e) => handleUpdateWhatsApp(wa.id, 'status', e.target.value)} style={{ padding: '4px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '4px' }}>
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="BANNED">BANNED</option>
                    </select>
                    <input type="text" value={wa.card_mask || ''} onChange={(e) => handleUpdateWhatsApp(wa.id, 'card_mask', e.target.value)} placeholder="Tarjeta" style={{ padding: '4px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '4px' }} />
                    <button onClick={() => handleDeleteWhatsApp(wa.id)} style={{ color: 'var(--danger)', background: 'transparent', border: 'none', cursor: 'pointer' }}><Trash2 size={16}/></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Simple Assets (Pages, Instagrams, Pixels) */}
          {['pages', 'instagrams', 'pixels'].includes(activeTab) && (() => {
            const config = {
              pages: { title: 'Páginas de Facebook', table: 'pages', field: 'name', data: pages },
              instagrams: { title: 'Cuentas de Instagram', table: 'instagram_accounts', field: 'handle', data: instagrams },
              pixels: { title: 'Píxeles', table: 'pixels', field: 'name', data: pixels }
            }[activeTab];

            return (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <h3 style={{ color: 'var(--text-primary)' }}>{config.title} ({config.data.length})</h3>
                  <button onClick={() => handleAddBasicAsset(config.table, config.field)} className="btn-outline" style={{ display: 'flex', gap: '4px', alignItems: 'center' }}><Plus size={16} /> Agregar</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {config.data.map(item => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                      <span style={{ color: 'var(--text-primary)' }}>{item[config.field]}</span>
                      <button onClick={() => handleDeleteBasicAsset(config.table, item.id)} style={{ color: 'var(--danger)', background: 'transparent', border: 'none', cursor: 'pointer' }}><Trash2 size={16}/></button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

        </div>
      </div>
    </div>
  );
};

export default AdminBMEditor;
