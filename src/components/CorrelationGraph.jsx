import React, { useEffect, useState, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import ForceGraph2D from 'react-force-graph-2d';
import { Loader2 } from 'lucide-react';

const CorrelationGraph = () => {
  const fgRef = useRef();
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const containerRef = useRef(null);

  useEffect(() => {
    // Responsive canvas
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: window.innerHeight - 250
        });
      }
    };
    
    window.addEventListener('resize', updateDimensions);
    updateDimensions();
    
    fetchData();

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const fetchData = async () => {
    try {
      const [bmsRes, adsRes, wasRes, pxsRes] = await Promise.all([
        supabase.from('business_managers').select('*'),
        supabase.from('ad_accounts').select('*'),
        supabase.from('whatsapp_lines').select('*'),
        supabase.from('pixels').select('*')
      ]);

      buildGraph(
        bmsRes.data || [], 
        adsRes.data || [], 
        wasRes.data || [], 
        pxsRes.data || []
      );
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const buildGraph = (bms, ads, was, pxs) => {
    const nodes = [];
    const links = [];
    
    // Mapas para evitar nodos duplicados en WhatsApps y Píxeles compartidos
    const waMap = new Map(); 
    const pxMap = new Map();
    const profileMap = new Map();

    bms.forEach(bm => {
      // 1. Agregar Nodos Perfil
      const profileId = `profile-${bm.facebook_profile}`;
      if (!profileMap.has(bm.facebook_profile)) {
        profileMap.set(bm.facebook_profile, true);
        nodes.push({
          id: profileId,
          name: bm.facebook_profile,
          group: 'Profile',
          val: 30,
          color: '#8b5cf6' // Morado para perfiles
        });
      }

      // 2. Determinar riesgo del BM para color
      const bmAds = ads.filter(a => a.bm_id === bm.id);
      const debt = bmAds.reduce((sum, a) => sum + (a.current_balance || 0), 0);
      const banned = bmAds.filter(a => a.status !== 'ACTIVE').length;
      let bmColor = '#3b82f6'; // Azul (Reserva)
      if (debt > 1000000 || banned > 0) bmColor = '#ef4444'; // Rojo (Tóxico)
      else if (bmAds.length > 0 && debt === 0) bmColor = '#10b981'; // Verde (Limpio)

      // 3. Agregar Nodo BM
      const bmNodeId = `bm-${bm.id}`;
      nodes.push({
        id: bmNodeId,
        name: bm.name,
        group: 'BM',
        val: 20,
        color: bmColor
      });

      // Conectar Perfil -> BM
      links.push({ source: profileId, target: bmNodeId, color: 'rgba(255,255,255,0.2)' });

      // 4. Conectar WhatsApps
      const bmWas = was.filter(w => w.bm_id === bm.id);
      bmWas.forEach(wa => {
        // En la base de datos, múltiples líneas con el mismo número son el MISMO activo
        // Si el número existe, lo tratamos como compartido
        const waKey = `wa-${wa.phone.replace(/\D/g, '') || wa.name}`;
        
        if (!waMap.has(waKey)) {
          waMap.set(waKey, true);
          nodes.push({
            id: waKey,
            name: wa.phone || wa.name,
            group: 'WhatsApp',
            val: 12,
            color: '#10b981' // Verde WP
          });
        }
        
        links.push({ source: bmNodeId, target: waKey, color: '#10b981' });
      });

      // 5. Conectar Píxeles
      const bmPxs = pxs.filter(p => p.bm_id === bm.id);
      bmPxs.forEach(px => {
        const pxKey = `px-${px.pixel_id || px.name}`;
        if (!pxMap.has(pxKey)) {
          pxMap.set(pxKey, true);
          nodes.push({
            id: pxKey,
            name: px.name,
            group: 'Pixel',
            val: 10,
            color: '#f59e0b' // Naranja
          });
        }
        links.push({ source: bmNodeId, target: pxKey, color: '#f59e0b' });
      });
      
      // 6. Conectar Cuentas (Opcional, puede sobrecargar, pero es útil)
      bmAds.forEach(ad => {
        const adNodeId = `ad-${ad.id}`;
        nodes.push({
          id: adNodeId,
          name: ad.name,
          group: 'AdAccount',
          val: 8,
          color: ad.status === 'ACTIVE' ? '#10b981' : '#ef4444' // Verde o Roja
        });
        links.push({ source: bmNodeId, target: adNodeId, color: 'rgba(255,255,255,0.1)' });
      });
    });

    setGraphData({ nodes, links });
  };

  const paintNode = useCallback((node, ctx, globalScale) => {
    const label = node.name;
    const fontSize = 12/globalScale;
    ctx.font = `${fontSize}px Sans-Serif`;
    const textWidth = ctx.measureText(label).width;
    const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); 

    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = node.color;
    ctx.fillText(label, node.x, node.y);

    node.__bckgDimensions = bckgDimensions; // to save computing time for pointer events
  }, []);

  const nodePointerAreaPaint = useCallback((node, color, ctx) => {
    ctx.fillStyle = color;
    const bckgDimensions = node.__bckgDimensions;
    bckgDimensions && ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);
  }, []);

  if (loading) return <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto text-accent-primary" size={48} /></div>;

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', minHeight: '600px', background: '#0a0a0a', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
      {/* Leyenda flotante */}
      <div style={{ position: 'absolute', zIndex: 10, padding: '15px', background: 'rgba(0,0,0,0.7)', borderRadius: '8px', margin: '15px', color: '#fff', fontSize: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
        <h4 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Leyenda (Zoom con Scroll, Arrastrar Nodos)</h4>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><span style={{ color: '#8b5cf6' }}>■</span> Perfil Raíz</div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><span style={{ color: '#ef4444' }}>■</span> BM Tóxico (Deuda/Baneos)</div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><span style={{ color: '#3b82f6' }}>■</span> BM Limpio/Azul</div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><span style={{ color: '#10b981' }}>■</span> WhatsApps Compartidos</div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><span style={{ color: '#f59e0b' }}>■</span> Píxeles</div>
      </div>
      
      <ForceGraph2D
        width={dimensions.width}
        height={dimensions.height}
        graphData={graphData}
        nodeLabel="name"
        nodeCanvasObject={paintNode}
        nodePointerAreaPaint={nodePointerAreaPaint}
        linkColor="color"
        linkWidth={1.5}
        d3VelocityDecay={0.1} // Hacemos que se muevan más fluido
        cooldownTicks={100}
        onEngineStop={() => {
          if(fgRef.current) {
            fgRef.current.zoomToFit(400);
          }
        }}
        ref={fgRef}
      />
    </div>
  );
};

export default CorrelationGraph;
