import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from '../lib/supabase';
import { UploadCloud, CheckCircle, AlertTriangle, Loader2, Sparkles } from 'lucide-react';

const AIPDFImporter = ({ onImportSuccess }) => {
  const [apiKey, setApiKey] = useState(localStorage.getItem('GEMINI_API_KEY') || '');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleApiKeyChange = (e) => {
    setApiKey(e.target.value);
    localStorage.setItem('GEMINI_API_KEY', e.target.value);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  // Convert File to Base64
  const fileToGenerativePart = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve({
          inlineData: { data: reader.result.split(',')[1], mimeType: file.type }
      });
      reader.readAsDataURL(file);
    });
  };

  const processPDF = async () => {
    if (!apiKey) {
      setError("Necesitas una API Key de Gemini para usar la Inteligencia Artificial.");
      return;
    }
    if (!file) {
      setError("Por favor selecciona un archivo PDF.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      setProgress("Analizando 60+ páginas con Inteligencia Artificial (esto puede tardar unos minutos)...");

      const genAI = new GoogleGenerativeAI(apiKey);
      // Use Gemini 1.5 Pro because it supports huge multimodal contexts natively
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

      const pdfPart = await fileToGenerativePart(file);

      const prompt = `
        Eres un experto en Facebook Ads. Analiza este PDF que contiene capturas de pantalla de Meta Business Manager.
        Quiero que extraigas TODOS los Business Managers (BMs) y sus activos.
        
        Regresa ÚNICAMENTE un objeto JSON válido con la siguiente estructura (no incluyes comillas invertidas de markdown ni texto extra):
        {
          "facebook_profile": "Nombre del perfil de facebook al que pertenecen (dedúcelo del título de la primera página)",
          "business_managers": [
            {
              "name": "Nombre del BM",
              "type": "ROOM o BACKUP",
              "ad_accounts": [
                { "name": "Nombre (ej: Ofertasz (5))", "status": "ACTIVE o BANNED", "ban_reason": "Error en el pago o Inhabilitada por Políticas o nulo si está activa", "card_mask": "últimos 4 dígitos o nulo", "balance": número entero }
              ],
              "pages": ["Nombre de la página 1", "Nombre de la página 2"],
              "instagrams": ["usuario1 sin el @", "usuario2"],
              "whatsapps": [
                { "name": "Nombre línea", "card_mask": "últimos 4 dígitos o nulo", "status": "ACTIVE o BANNED" }
              ],
              "pixels": ["Nombre pixel 1"]
            }
          ]
        }
      `;

      setProgress("Leyendo imágenes y estructurando datos (Gemini AI trabajando)...");
      const result = await model.generateContent([prompt, pdfPart]);
      const response = await result.response;
      let text = response.text();
      
      // Clean up markdown block if present
      if (text.includes('```json')) {
        text = text.replace(/```json/g, '').replace(/```/g, '');
      }

      setProgress("Interpretando JSON e inyectando a la Base de Datos...");
      const data = JSON.parse(text);
      const profile = data.facebook_profile || 'Perfil Automático';

      // Insert into Supabase
      for (const bm of data.business_managers) {
        setProgress(`Guardando BM: ${bm.name}...`);
        
        // 1. Create BM
        const { data: bmData, error: bmError } = await supabase.from('business_managers').insert([
          { name: bm.name, type: bm.type || 'ROOM', facebook_profile: profile, status: 'ACTIVE' }
        ]).select();
        
        if (bmError) {
          console.error("Error inserting BM", bmError);
          continue;
        }
        
        const bmId = bmData[0].id;

        // 2. Ad Accounts
        if (bm.ad_accounts && bm.ad_accounts.length > 0) {
          const accountsToInsert = bm.ad_accounts.map(acc => ({
            bm_id: bmId,
            name: acc.name,
            status: acc.status || 'ACTIVE',
            ban_reason: acc.ban_reason || null,
            card_mask: acc.card_mask || null,
            current_balance: acc.balance || 0,
            meta_account_id: 'AUTO_GENERATED'
          }));
          await supabase.from('ad_accounts').insert(accountsToInsert);
        }

        // 3. Pages
        if (bm.pages && bm.pages.length > 0) {
          await supabase.from('pages').insert(bm.pages.map(p => ({ bm_id: bmId, name: p })));
        }

        // 4. Instagrams
        if (bm.instagrams && bm.instagrams.length > 0) {
          await supabase.from('instagram_accounts').insert(bm.instagrams.map(ig => ({ bm_id: bmId, handle: ig })));
        }

        // 5. Pixels
        if (bm.pixels && bm.pixels.length > 0) {
          await supabase.from('pixels').insert(bm.pixels.map(px => ({ bm_id: bmId, name: px })));
        }

        // 6. WhatsApps
        if (bm.whatsapps && bm.whatsapps.length > 0) {
          const waToInsert = bm.whatsapps.map(wa => ({
            bm_id: bmId,
            name: wa.name || wa,
            card_mask: wa.card_mask || null,
            status: wa.status || 'ACTIVE',
            phone: 'N/A'
          }));
          await supabase.from('whatsapp_lines').insert(waToInsert);
        }
      }

      setSuccess(true);
      setProgress("¡Extracción e inyección completada con éxito!");
      if (onImportSuccess) onImportSuccess();

    } catch (err) {
      console.error(err);
      setError(err.message || "Ocurrió un error inesperado al leer el PDF.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card" style={{ background: 'linear-gradient(145deg, rgba(20,20,30,0.8) 0%, rgba(30,20,50,0.8) 100%)', border: '1px solid var(--accent-primary)' }}>
      <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Sparkles className="text-accent-primary" />
        Auto-Importar PDF con Inteligencia Artificial
      </h2>
      
      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
        Sube el PDF con las capturas de pantalla del perfil de Facebook. El sistema leerá mágicamente las imágenes, estructurará las cuentas, tarjetas, baneos y saldos, y los guardará en tu base de datos automáticamente.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div>
          <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Gemini API Key (Google AI Studio)</label>
          <input 
            type="password" 
            value={apiKey}
            onChange={handleApiKeyChange}
            placeholder="AIzaSy..."
            style={{ width: '100%', padding: '8px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)' }}
          />
        </div>

        <div style={{ position: 'relative' }}>
          <input 
            type="file" 
            accept="application/pdf"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            id="pdf-upload"
          />
          <label 
            htmlFor="pdf-upload"
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', border: '2px dashed var(--border-color)', borderRadius: '8px', cursor: 'pointer', background: 'var(--bg-primary)', color: 'var(--text-secondary)', transition: 'all 0.2s' }}
          >
            <UploadCloud size={24} style={{ marginBottom: '8px', color: file ? 'var(--success)' : 'var(--text-muted)' }} />
            <span style={{ fontSize: '14px', fontWeight: '600' }}>
              {file ? file.name : 'Haz clic para seleccionar el PDF del perfil'}
            </span>
          </label>
        </div>

        {error && (
          <div style={{ padding: '12px', background: 'rgba(255,0,0,0.1)', border: '1px solid var(--danger)', borderRadius: '6px', color: 'var(--danger)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={16} /> {error}
          </div>
        )}

        {progress && !error && !success && (
          <div style={{ padding: '12px', background: 'var(--bg-tertiary)', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Loader2 size={16} className="animate-spin text-accent-primary" /> {progress}
          </div>
        )}

        {success && (
          <div style={{ padding: '12px', background: 'rgba(0,255,0,0.1)', border: '1px solid var(--success)', borderRadius: '6px', color: 'var(--success)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle size={16} /> {progress}
          </div>
        )}

        <button 
          onClick={processPDF}
          disabled={loading || !file}
          style={{ background: 'var(--accent-primary)', color: '#000', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold', cursor: (loading || !file) ? 'not-allowed' : 'pointer', opacity: (loading || !file) ? 0.5 : 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '8px' }}
        >
          {loading ? 'Procesando...' : 'Iniciar Escaneo Mágico con IA'}
        </button>
      </div>
    </div>
  );
};

export default AIPDFImporter;
