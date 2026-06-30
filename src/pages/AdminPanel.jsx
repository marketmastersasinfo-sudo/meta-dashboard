import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Database, Plus, RefreshCw, Layers, Edit, Trash2, Cpu, Loader2 } from 'lucide-react';
import AdminBMEditor from '../components/AdminBMEditor';
import AIPDFImporter from '../components/AIPDFImporter';

const AdminPanel = () => {
  const [bms, setBms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBM, setSelectedBM] = useState(null);
  
  // Create BM state
  const [newBMName, setNewBMName] = useState('');
  const [newBMType, setNewBMType] = useState('ROOM');
  const [newBMProfile, setNewBMProfile] = useState('Paula Rojas');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchBMs();
  }, []);

  const fetchBMs = async () => {
    setLoading(true);
    const { data } = await supabase.from('business_managers').select('*').order('name');
    setBms(data || []);
    setLoading(false);
  };

  const handleCreateBM = async (e) => {
    e.preventDefault();
    if (!newBMName.trim()) return;
    
    setIsCreating(true);
    const { data, error } = await supabase.from('business_managers').insert([
      { name: newBMName, type: newBMType, facebook_profile: newBMProfile, status: 'ACTIVE' }
    ]).select();
    
    setIsCreating(false);
    if (!error && data) {
      setNewBMName('');
      fetchBMs();
    } else {
      alert("Error creating BM: " + error.message);
    }
  };

  const handleDeleteBM = async (id, name) => {
    if (window.confirm(`¿Estás seguro de eliminar el BM "${name}"? Esto borrará todas sus cuentas y activos asociados.`)) {
      await supabase.from('business_managers').delete().eq('id', id);
      fetchBMs();
    }
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Database className="text-accent-primary" size={32} />
            Panel de Administración
          </h1>
          <p className="page-subtitle">Gestiona toda la base de datos de tu estructura publicitaria</p>
        </div>
        <button onClick={fetchBMs} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <RefreshCw size={16} />
          Refrescar Datos
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '24px' }}>
        
        {/* Columna Izquierda: Lista de BMs */}
        <div className="glass-card">
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: 'var(--text-primary)' }}>
            Inventario de Business Managers
          </h2>
          
          {loading ? (
            <p style={{ color: 'var(--text-muted)' }}>Cargando datos...</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {bms.map(bm => (
                <div key={bm.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div>
                    <h3 style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{bm.name}</h3>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', gap: '8px', marginTop: '4px' }}>
                      <span className={`badge badge-${bm.status === 'ACTIVE' ? 'success' : 'danger'}`} style={{ fontSize: '10px' }}>{bm.status}</span>
                      <span className="badge" style={{ fontSize: '10px' }}>{bm.type}</span>
                      <span>Perfil: {bm.facebook_profile}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => setSelectedBM(bm)}
                      style={{ background: 'var(--accent-primary)', color: '#000', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}
                    >
                      <Edit size={14} /> Administrar Activos
                    </button>
                    <button 
                      onClick={() => handleDeleteBM(bm.id, bm.name)}
                      style={{ background: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '8px', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Columna Derecha: Creación y Módulo IA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <AIPDFImporter onImportSuccess={fetchBMs} />

          <div className="glass-card">
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: 'var(--text-primary)' }}>
              Crear BM Manualmente
            </h2>
            <form onSubmit={handleCreateBM} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Nombre del BM</label>
                <input 
                  type="text" 
                  value={newBMName}
                  onChange={e => setNewBMName(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)' }}
                  placeholder="Ej: Maxitiendas y Yacompro"
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Tipo de BM</label>
                <select 
                  value={newBMType}
                  onChange={e => setNewBMType(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)' }}
                >
                  <option value="ROOM">ROOM (Anunciante)</option>
                  <option value="BACKUP">BACKUP (Bóveda)</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Perfil de Facebook Asignado</label>
                <input 
                  type="text" 
                  value={newBMProfile}
                  onChange={e => setNewBMProfile(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)' }}
                  placeholder="Ej: Paula Rojas"
                  required
                />
              </div>
              <button 
                type="submit" 
                disabled={isCreating}
                style={{ background: 'var(--success)', color: '#fff', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '8px' }}
              >
                {isCreating ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                Crear BM
              </button>
            </form>
          </div>
        </div>

      </div>

      {selectedBM && (
        <AdminBMEditor bm={selectedBM} onClose={() => { setSelectedBM(null); fetchBMs(); }} />
      )}
    </div>
  );
};

export default AdminPanel;
