import React, { useState } from 'react';
import { CheckSquare, Square, Smartphone, Box, ShieldCheck, ArrowRight, Server, Infinity } from 'lucide-react';

const ActionPlan = () => {
  const [checked, setChecked] = useState({});

  const toggleCheck = (id) => {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const tasks = [
    {
      id: 'paula',
      title: '🛡️ Fase 1: Bóveda Paula Rojas',
      color: '#a855f7',
      steps: [
        { id: 'p1', text: 'Abre MoreLogin e inicia sesión en el perfil de Paula Rojas.' },
        { id: 'p2', text: 'Entra al BM "distribuidorof" (Reserva limpia) y cámbiale el nombre a "BÓVEDA-PAULA".' },
        { id: 'p3', text: 'Desde el BM "Mundo Compra" (Tóxico), extrae el WhatsApp "Lacompracion" y los píxeles, pasándolos a "BÓVEDA-PAULA".' },
        { id: 'p4', text: 'Repite la extracción para todos los activos valiosos de Paula. La BÓVEDA-PAULA debe quedar con todos los WAs y Píxeles.' },
        { id: 'p5', text: '¡LISTO! Conecta Chatify y Shopyeasy a BÓVEDA-PAULA. Nunca le pongas tarjetas a este BM.' }
      ]
    },
    {
      id: 'luz',
      title: '🛡️ Fase 2: Bóveda Luz Angela',
      color: '#10b981',
      steps: [
        { id: 'l1', text: 'Abre MoreLogin e inicia sesión en el perfil de Luz Angela.' },
        { id: 'l2', text: 'Entra al BM "comprasenunclickco" (Reserva limpia) y cámbiale el nombre a "BÓVEDA-LUZ".' },
        { id: 'l3', text: 'Extrae los WhatsApps (ej. "YaencasaCP", "Serv. Cliente Ofertazo") de los BMs con deuda hacia "BÓVEDA-LUZ".' },
        { id: 'l4', text: 'Mueve todos los Píxeles (Releasit, Funnelish, etc.) a "BÓVEDA-LUZ".' },
        { id: 'l5', text: '¡LISTO! Conecta Chatify y Shopyeasy a BÓVEDA-LUZ. Prohibido pautar desde aquí.' }
      ]
    },
    {
      id: 'nelson',
      title: '🛡️ Fase 3: Bóveda Nelson Lopez',
      color: '#3b82f6',
      steps: [
        { id: 'n1', text: 'Abre MoreLogin e inicia sesión en el perfil de Nelson Lopez.' },
        { id: 'n2', text: 'Crea un Business Manager 100% NUEVO llamado "BÓVEDA-NELSON".' },
        { id: 'n3', text: 'Asegúrate de que los píxeles ("ComprasYa FB More Login", etc.) estén guardados aquí.' },
        { id: 'n4', text: 'Si Nelson va a tener un número de WhatsApp para Chatify, conéctalo a esta Bóveda.' }
      ]
    },
    {
      id: 'guerreros',
      title: '⚔️ Fase 4: Despliegue de Guerreros (La Pauta)',
      color: '#06b6d4',
      steps: [
        { id: 'g1', text: 'PAULA: Abre tu BÓVEDA-PAULA. Ve a Socios y comparte el Pixel a tus BMs Guerreros (Techshop, myblustore.com, argenshop, monshopco).' },
        { id: 'g2', text: 'LUZ ANGELA: Abre BÓVEDA-LUZ y comparte el Pixel a tus BMs Guerreros (Tiendapapaya, Uwashop, Yacompro, guateshop).' },
        { id: 'g3', text: 'GABRIELA TEGUCHI: Como no tienes bóveda, solo pauta desde "Sophia Recomienda" usando sus propios activos.' },
        { id: 'g4', text: 'Agrega las tarjetas de crédito NUEVAS a los Guerreros (Máximo 2 cuentas activas por tarjeta). ¡Y lanza campañas!' }
      ]
    },
    {
      id: 'scale',
      title: '🚀 Fase 5: Regla de Escalabilidad Infinita (Nuevas Tiendas/Países)',
      color: '#f59e0b',
      steps: [
        { id: 's1', text: 'Cuando compres un NUEVO PERFIL en MoreLogin, lo primero que haces es crear un BM llamado "BÓVEDA-[NOMBRE]".' },
        { id: 's2', text: 'Compras tu nuevo número de WhatsApp y lo verificas EXCLUSIVAMENTE en esa Bóveda. Ahí anclas Chatify.' },
        { id: 's3', text: 'Creas el Pixel de la nueva tienda EXCLUSIVAMENTE en esa Bóveda. Ahí anclas Shopyeasy.' },
        { id: 's4', text: 'Luego, creas o compras otros 2 BMs en ese mismo perfil para usarlos como "Guerreros". Les pasas el Pixel por invitación de Socio y les pones la tarjeta.' },
        { id: 's5', text: 'Siguiendo este patrón, puedes tener 100 perfiles y 1,000 WAs, y ninguno se mezclará ni se infectará si banean a otro.' }
      ]
    }
  ];

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out', maxWidth: '900px', margin: '0 auto', paddingBottom: '40px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ color: 'var(--text-primary)', margin: '0 0 10px 0', fontSize: '28px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <CheckSquare size={32} color="#a855f7" /> 
          Checklist de Ejecución (Paso a Paso)
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: '1.6' }}>
          Sigue estas instrucciones al pie de la letra dentro de MoreLogin. Este protocolo garantiza que tus activos queden protegidos y listos para escalar infinitamente con Chatify y Shopyeasy.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {tasks.map(section => (
          <div key={section.id} style={{ 
            background: 'var(--bg-secondary)', 
            borderRadius: '12px', 
            border: `1px solid ${section.color}30`,
            overflow: 'hidden',
            boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
          }}>
            <div style={{ background: `${section.color}15`, padding: '16px 20px', borderBottom: `1px solid ${section.color}20` }}>
              <h2 style={{ margin: 0, color: section.color, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                {section.title}
              </h2>
            </div>
            <div style={{ padding: '20px' }}>
              {section.steps.map(step => (
                <div 
                  key={step.id} 
                  onClick={() => toggleCheck(step.id)}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    gap: '12px', 
                    padding: '12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: checked[step.id] ? 'var(--bg-primary)' : 'transparent',
                    opacity: checked[step.id] ? 0.6 : 1
                  }}
                  className="hover-bg-primary"
                >
                  <div style={{ marginTop: '2px', color: checked[step.id] ? section.color : 'var(--text-tertiary)' }}>
                    {checked[step.id] ? <CheckSquare size={20} /> : <Square size={20} />}
                  </div>
                  <div style={{ 
                    color: 'var(--text-primary)', 
                    fontSize: '15px', 
                    lineHeight: '1.5',
                    textDecoration: checked[step.id] ? 'line-through' : 'none'
                  }}>
                    {step.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActionPlan;
