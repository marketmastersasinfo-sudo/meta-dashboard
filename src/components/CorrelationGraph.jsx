import React, { useEffect, useState, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import ForceGraph2D from 'react-force-graph-2d';
import { Loader2 } from 'lucide-react';

const NODE_TYPES = {
  Profile: { emoji: '👤', radius: 22, fontSize: 13 },
  BM:      { emoji: '🏢', radius: 16, fontSize: 11 },
  AdAccount: { emoji: '🎯', radius: 10, fontSize: 9 },
  WhatsApp: { emoji: '💬', radius: 14, fontSize: 10 },
  Pixel:    { emoji: '📦', radius: 12, fontSize: 10 },
};

const ZONE_COLORS = {
  profile: '#a855f7',
  bmClean: '#3b82f6',
  bmToxic: '#ef4444',
  bmGreen: '#10b981',
  whatsapp: '#25d366',
  pixel: '#f59e0b',
  adActive: '#10b981',
  adBanned: '#ef4444',
};

const CorrelationGraph = () => {
  const fgRef = useRef(null);
  const containerRef = useRef(null);
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 750 });
  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());
  const [hoverNode, setHoverNode] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState('ALL');
  const [showAds, setShowAds] = useState(false);
  const [stats, setStats] = useState({ profiles: 0, bms: 0, ads: 0, was: 0, pxs: 0 });

  // Responsive sizing
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: rect.width,
          height: Math.max(window.innerHeight - 200, 650)
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [bmsRes, adsRes, wasRes, pxsRes] = await Promise.all([
        supabase.from('business_managers').select('*'),
        supabase.from('ad_accounts').select('*'),
        supabase.from('whatsapp_lines').select('*'),
        supabase.from('pixels').select('*')
      ]);
      const bms = bmsRes.data || [];
      const ads = adsRes.data || [];
      const was = wasRes.data || [];
      const pxs = pxsRes.data || [];
      
      setStats({
        profiles: new Set(bms.map(b => b.facebook_profile)).size,
        bms: bms.length,
        ads: ads.length,
        was: was.length,
        pxs: pxs.length
      });
      
      buildGraph(bms, ads, was, pxs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const buildGraph = useCallback((bms, ads, was, pxs) => {
    const nodes = [];
    const links = [];
    const profileSet = new Set();
    const waDedup = new Map();
    const pxDedup = new Map();

    bms.forEach(bm => {
      // Profile nodes
      const pid = `profile::${bm.facebook_profile}`;
      if (!profileSet.has(pid)) {
        profileSet.add(pid);
        nodes.push({ id: pid, name: bm.facebook_profile, group: 'Profile', color: ZONE_COLORS.profile, profile: bm.facebook_profile });
      }

      // BM risk
      const bmAds = ads.filter(a => a.bm_id === bm.id);
      const debt = bmAds.reduce((s, a) => s + (a.current_balance || 0), 0);
      const banned = bmAds.filter(a => a.status !== 'ACTIVE').length;
      const active = bmAds.filter(a => a.status === 'ACTIVE').length;

      let bmColor = ZONE_COLORS.bmClean;
      let zone = 'Reserva';
      if (debt > 1000000 || (banned > active && bmAds.length > 0)) { bmColor = ZONE_COLORS.bmToxic; zone = 'Tóxico'; }
      else if (active > 0 && debt === 0 && banned === 0) { bmColor = ZONE_COLORS.bmGreen; zone = 'Limpio'; }
      else if (banned > 0) { bmColor = ZONE_COLORS.bmToxic; zone = 'Tóxico'; }

      const bmId = `bm::${bm.id}`;
      nodes.push({ id: bmId, name: bm.name, group: 'BM', color: bmColor, zone, debt, banned, active, adsCount: bmAds.length, profile: bm.facebook_profile });
      links.push({ source: pid, target: bmId, color: 'rgba(168,85,247,0.25)', width: 2 });

      // WhatsApps
      was.filter(w => w.bm_id === bm.id).forEach(wa => {
        const wKey = `wa::${(wa.phone || '').replace(/\D/g, '') || wa.name}`;
        if (!waDedup.has(wKey)) {
          waDedup.set(wKey, []);
          nodes.push({ id: wKey, name: wa.phone || wa.name, group: 'WhatsApp', color: ZONE_COLORS.whatsapp, profile: '__shared' });
        }
        waDedup.get(wKey).push(bmId);
        links.push({ source: bmId, target: wKey, color: 'rgba(37,211,102,0.4)', width: 2.5 });
      });

      // Pixels
      pxs.filter(p => p.bm_id === bm.id).forEach(px => {
        const pKey = `px::${px.pixel_id || px.name}`;
        if (!pxDedup.has(pKey)) {
          pxDedup.set(pKey, []);
          nodes.push({ id: pKey, name: px.name, group: 'Pixel', color: ZONE_COLORS.pixel, profile: '__shared' });
        }
        pxDedup.get(pKey).push(bmId);
        links.push({ source: bmId, target: pKey, color: 'rgba(245,158,11,0.35)', width: 1.5 });
      });

      // Ad Accounts
      bmAds.forEach(ad => {
        const adId = `ad::${ad.id}`;
        nodes.push({
          id: adId, name: ad.name || `Cuenta ${ad.meta_account_id}`, group: 'AdAccount',
          color: ad.status === 'ACTIVE' ? ZONE_COLORS.adActive : ZONE_COLORS.adBanned,
          profile: bm.facebook_profile
        });
        links.push({ source: bmId, target: adId, color: 'rgba(255,255,255,0.08)', width: 0.8 });
      });
    });

    // Mark shared WAs (connected to multiple BMs) as dangerous
    waDedup.forEach((bmIds, wKey) => {
      if (bmIds.length > 1) {
        const node = nodes.find(n => n.id === wKey);
        if (node) node.shared = true;
      }
    });

    setGraphData({ nodes, links });
  }, []);

  // Highlight neighbors on hover
  const handleNodeHover = useCallback(node => {
    const hl = new Set();
    const hlLinks = new Set();
    if (node) {
      hl.add(node);
      if (graphData) {
        graphData.links.forEach(link => {
          const src = typeof link.source === 'object' ? link.source : null;
          const tgt = typeof link.target === 'object' ? link.target : null;
          if (src && tgt) {
            if (src.id === node.id) { hl.add(tgt); hlLinks.add(link); }
            if (tgt.id === node.id) { hl.add(src); hlLinks.add(link); }
          }
        });
      }
    }
    setHighlightNodes(hl);
    setHighlightLinks(hlLinks);
    setHoverNode(node || null);
  }, [graphData]);

  // Canvas paint for each node
  const paintNode = useCallback((node, ctx, globalScale) => {
    const cfg = NODE_TYPES[node.group] || NODE_TYPES.BM;
    const r = cfg.radius;
    const isHighlighted = highlightNodes.size === 0 || highlightNodes.has(node);
    const alpha = isHighlighted ? 1 : 0.15;

    // Glow effect for highlighted
    if (highlightNodes.has(node) && highlightNodes.size > 0) {
      ctx.shadowColor = node.color;
      ctx.shadowBlur = 20;
    }

    // Circle background
    ctx.beginPath();
    ctx.arc(node.x, node.y, r, 0, 2 * Math.PI, false);
    ctx.fillStyle = hexToRGBA(node.color, alpha * 0.2);
    ctx.fill();
    ctx.strokeStyle = hexToRGBA(node.color, alpha * 0.8);
    ctx.lineWidth = node.shared ? 3 : 1.5;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Shared WA pulsing ring
    if (node.shared) {
      ctx.beginPath();
      ctx.arc(node.x, node.y, r + 4, 0, 2 * Math.PI, false);
      ctx.strokeStyle = hexToRGBA('#ff0000', alpha * 0.6);
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Emoji icon
    const emojiSize = r * 0.9;
    ctx.font = `${emojiSize}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.globalAlpha = alpha;
    ctx.fillText(cfg.emoji, node.x, node.y - 1);
    ctx.globalAlpha = 1;

    // Label below
    const showLabel = globalScale > 0.6 || highlightNodes.has(node);
    if (showLabel) {
      const label = truncate(node.name, 22);
      const fs = Math.min(cfg.fontSize, 14 / globalScale);
      ctx.font = `bold ${fs}px 'Inter', 'Segoe UI', sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';

      // Text shadow
      const tw = ctx.measureText(label).width;
      const pad = 4;
      ctx.fillStyle = hexToRGBA('#000000', alpha * 0.75);
      ctx.fillRect(node.x - tw / 2 - pad, node.y + r + 2, tw + pad * 2, fs + pad);

      ctx.fillStyle = hexToRGBA(node.color, alpha);
      ctx.fillText(label, node.x, node.y + r + 4);
    }
  }, [highlightNodes]);

  const paintLink = useCallback((link, ctx) => {
    const isHl = highlightLinks.has(link);
    ctx.strokeStyle = isHl ? link.color.replace(/[\d.]+\)$/, '0.9)') : link.color;
    ctx.lineWidth = isHl ? (link.width || 1) * 2.5 : (link.width || 1);
    ctx.beginPath();
    const src = link.source;
    const tgt = link.target;
    if (src && tgt && src.x != null && tgt.x != null) {
      ctx.moveTo(src.x, src.y);
      ctx.lineTo(tgt.x, tgt.y);
      ctx.stroke();
    }
  }, [highlightLinks]);

  // Filter data by profile
  const getFilteredData = useCallback(() => {
    if (!graphData) return { nodes: [], links: [] };
    if (selectedProfile === 'ALL' && showAds) return graphData;

    let filteredNodes = graphData.nodes;
    
    // Hide ad accounts unless toggled
    if (!showAds) {
      filteredNodes = filteredNodes.filter(n => n.group !== 'AdAccount');
    }
    
    // Filter by profile
    if (selectedProfile !== 'ALL') {
      const profileBMs = new Set(filteredNodes.filter(n => n.profile === selectedProfile && n.group === 'BM').map(n => n.id));
      filteredNodes = filteredNodes.filter(n => {
        if (n.group === 'Profile') return n.profile === selectedProfile;
        if (n.group === 'BM' || n.group === 'AdAccount') return n.profile === selectedProfile;
        // For WA/Pixel, keep if linked to any visible BM
        return true;
      });
    }

    const nodeIds = new Set(filteredNodes.map(n => n.id));
    const filteredLinks = graphData.links.filter(l => {
      const sId = typeof l.source === 'object' ? l.source.id : l.source;
      const tId = typeof l.target === 'object' ? l.target.id : l.target;
      return nodeIds.has(sId) && nodeIds.has(tId);
    });

    // Remove orphan shared nodes
    const linkedIds = new Set();
    filteredLinks.forEach(l => {
      linkedIds.add(typeof l.source === 'object' ? l.source.id : l.source);
      linkedIds.add(typeof l.target === 'object' ? l.target.id : l.target);
    });
    const finalNodes = filteredNodes.filter(n => linkedIds.has(n.id));

    return { nodes: finalNodes, links: filteredLinks };
  }, [graphData, selectedProfile, showAds]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh', flexDirection: 'column', gap: '16px' }}>
        <Loader2 size={48} style={{ animation: 'spin 1s linear infinite', color: '#a855f7' }} />
        <p style={{ color: '#9ca3af' }}>Cargando infraestructura completa...</p>
      </div>
    );
  }

  const profiles = graphData ? [...new Set(graphData.nodes.filter(n => n.group === 'Profile').map(n => n.name))] : [];
  const filtered = getFilteredData();

  return (
    <div ref={containerRef} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0' }}>
      
      {/* Stats Bar */}
      <div style={{
        display: 'flex', gap: '16px', padding: '12px 20px',
        background: 'linear-gradient(135deg, rgba(168,85,247,0.08), rgba(59,130,246,0.08))',
        borderRadius: '12px 12px 0 0', border: '1px solid rgba(168,85,247,0.2)',
        borderBottom: 'none', flexWrap: 'wrap', alignItems: 'center'
      }}>
        <StatBadge label="Perfiles" value={stats.profiles} color="#a855f7" />
        <StatBadge label="BMs" value={stats.bms} color="#3b82f6" />
        <StatBadge label="Cuentas Pub" value={stats.ads} color="#10b981" />
        <StatBadge label="WhatsApps" value={stats.was} color="#25d366" />
        <StatBadge label="Píxeles" value={stats.pxs} color="#f59e0b" />
        
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {/* Profile filter pills */}
          <FilterPill active={selectedProfile === 'ALL'} onClick={() => setSelectedProfile('ALL')} color="#a855f7">
            Todos
          </FilterPill>
          {profiles.map(p => (
            <FilterPill key={p} active={selectedProfile === p} onClick={() => setSelectedProfile(p)} color="#3b82f6">
              {p.split(' ')[0]}
            </FilterPill>
          ))}
          <FilterPill active={showAds} onClick={() => setShowAds(!showAds)} color="#10b981">
            {showAds ? '🎯 Ocultar Cuentas' : '🎯 Ver Cuentas'}
          </FilterPill>
        </div>
      </div>

      {/* Graph Canvas */}
      <div style={{
        position: 'relative',
        background: 'radial-gradient(ellipse at center, #0f0f23 0%, #030308 100%)',
        borderRadius: '0 0 12px 12px',
        border: '1px solid rgba(168,85,247,0.2)',
        overflow: 'hidden'
      }}>
        {/* Floating Legend */}
        <div style={{
          position: 'absolute', top: '16px', left: '16px', zIndex: 20,
          padding: '14px 18px', borderRadius: '10px',
          background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.1)',
          fontSize: '12px', color: '#e5e7eb', lineHeight: '1.8'
        }}>
          <div style={{ fontWeight: '700', fontSize: '13px', marginBottom: '6px', color: '#fff' }}>
            🧠 Leyenda
          </div>
          <LegendItem emoji="👤" color="#a855f7" label="Perfil Facebook" />
          <LegendItem emoji="🏢" color="#10b981" label="BM Limpio" />
          <LegendItem emoji="🏢" color="#ef4444" label="BM Tóxico" />
          <LegendItem emoji="🏢" color="#3b82f6" label="BM Reserva" />
          <LegendItem emoji="💬" color="#25d366" label="WhatsApp" />
          <LegendItem emoji="📦" color="#f59e0b" label="Pixel" />
          <div style={{ marginTop: '8px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '8px', fontSize: '11px', color: '#9ca3af' }}>
            <div>🖱️ Scroll = Zoom</div>
            <div>🖐️ Arrastra = Mover nodos</div>
            <div style={{ color: '#ef4444', fontWeight: 'bold', marginTop: '4px' }}>
              🔴 Borde rojo punteado = Compartido
            </div>
          </div>
        </div>

        {/* Hover tooltip */}
        {hoverNode && (
          <div style={{
            position: 'absolute', top: '16px', right: '16px', zIndex: 20,
            padding: '16px 20px', borderRadius: '10px', minWidth: '220px',
            background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)',
            border: `1px solid ${hoverNode.color}40`,
            fontSize: '13px', color: '#e5e7eb'
          }}>
            <div style={{ fontWeight: '700', fontSize: '15px', color: hoverNode.color, marginBottom: '8px' }}>
              {NODE_TYPES[hoverNode.group]?.emoji} {hoverNode.name}
            </div>
            <div style={{ color: '#9ca3af', fontSize: '11px', marginBottom: '6px' }}>
              Tipo: {hoverNode.group === 'BM' ? 'Business Manager' : hoverNode.group === 'AdAccount' ? 'Cuenta Publicitaria' : hoverNode.group}
            </div>
            {hoverNode.zone && (
              <div style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
                <span>Zona:</span>
                <span style={{ color: hoverNode.color, fontWeight: 'bold' }}>{hoverNode.zone}</span>
              </div>
            )}
            {hoverNode.debt != null && hoverNode.debt > 0 && (
              <div style={{ color: '#ef4444' }}>💰 Deuda: ${hoverNode.debt.toLocaleString()}</div>
            )}
            {hoverNode.adsCount != null && (
              <div>📊 Cuentas: {hoverNode.active}✅ {hoverNode.banned}❌</div>
            )}
            {hoverNode.shared && (
              <div style={{ color: '#ef4444', fontWeight: 'bold', marginTop: '6px' }}>
                ⚠️ COMPARTIDO entre múltiples BMs
              </div>
            )}
          </div>
        )}

        <ForceGraph2D
          ref={fgRef}
          width={dimensions.width}
          height={dimensions.height}
          graphData={filtered}
          nodeCanvasObject={paintNode}
          linkCanvasObject={paintLink}
          nodePointerAreaPaint={(node, color, ctx) => {
            const r = NODE_TYPES[node.group]?.radius || 14;
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(node.x, node.y, r + 4, 0, 2 * Math.PI);
            ctx.fill();
          }}
          onNodeHover={handleNodeHover}
          onNodeClick={node => {
            if (fgRef.current) {
              fgRef.current.centerAt(node.x, node.y, 800);
              fgRef.current.zoom(3, 800);
            }
          }}
          cooldownTicks={120}
          d3AlphaDecay={0.02}
          d3VelocityDecay={0.15}
          d3AlphaMin={0.001}
          linkDirectionalParticles={link => highlightLinks.has(link) ? 4 : 0}
          linkDirectionalParticleWidth={3}
          linkDirectionalParticleColor={() => '#fff'}
          onEngineStop={() => {
            if (fgRef.current) fgRef.current.zoomToFit(600, 80);
          }}
          backgroundColor="transparent"
          enableZoomInteraction={true}
          enablePanInteraction={true}
          enableNodeDrag={true}
        />
      </div>
    </div>
  );
};

/* ─── Utility Components ─── */

const StatBadge = ({ label, value, color }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: '28px', height: '28px', borderRadius: '8px',
      background: `${color}20`, color, fontWeight: '800', fontSize: '14px'
    }}>{value}</span>
    <span style={{ fontSize: '12px', color: '#9ca3af' }}>{label}</span>
  </div>
);

const FilterPill = ({ active, onClick, color, children }) => (
  <button onClick={onClick} style={{
    padding: '5px 14px', borderRadius: '20px', cursor: 'pointer',
    fontSize: '12px', fontWeight: '600', transition: 'all 0.2s',
    border: `1px solid ${active ? color : 'rgba(255,255,255,0.15)'}`,
    background: active ? `${color}25` : 'rgba(255,255,255,0.04)',
    color: active ? color : '#9ca3af'
  }}>
    {children}
  </button>
);

const LegendItem = ({ emoji, color, label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    <span>{emoji}</span>
    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, display: 'inline-block' }}></span>
    <span>{label}</span>
  </div>
);

/* ─── Helpers ─── */

function hexToRGBA(hex, alpha) {
  if (hex.startsWith('rgba')) return hex;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function truncate(str, len) {
  if (!str) return '';
  return str.length > len ? str.substring(0, len) + '…' : str;
}

export default CorrelationGraph;
