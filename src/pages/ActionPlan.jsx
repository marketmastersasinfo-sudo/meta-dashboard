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
        { 
          id: 'p1', 
          text: 'Paso 1: Entra al navegador donde tienes el perfil de Paula Rojas y abre business.facebook.com.' 
        },
        { 
          id: 'p2', 
          text: 'Paso 2: Ve a la configuración del BM "distribuidorof" (que está limpio). Ve a "Información del negocio" y cámbiale el nombre a "BÓVEDA-PAULA" para que no te confundas.' 
        },
        { 
          id: 'p3', 
          text: 'Paso 3 (Extraer WhatsApp): Entra a la configuración del BM tóxico "Mundo Compra". En el menú izquierdo ve a "Cuentas" -> "Cuentas de WhatsApp". Toca el número "Lacompracion". Dale clic a "Asignar Socios" e ingresa el ID del BM "BÓVEDA-PAULA". Dale todos los permisos. (NOTA: Si Facebook no te deja compartirlo por deuda, tendrás que ir a "Eliminar de la cuenta comercial" y luego volver a verificar el número directamente dentro del BM BÓVEDA-PAULA).' 
        },
        { 
          id: 'p4', 
          text: 'Paso 4 (Extraer Píxel): En "Mundo Compra", ve a "Orígenes de datos" -> "Conjuntos de datos" (Píxeles). Toca tu píxel. Dale a "Asignar Socios" e ingresa el ID de "BÓVEDA-PAULA" con control total.' 
        },
        { 
          id: 'p5', 
          text: 'Paso 5: Repite esto hasta que BÓVEDA-PAULA tenga acceso (como socio o dueño) a todos tus WhatsApps y Píxeles valiosos de Paula. ¡Ahí conectas Chatify!' 
        }
      ]
    },
    {
      id: 'luz',
      title: '🛡️ Fase 2: Bóveda Luz Angela',
      color: '#10b981',
      steps: [
        { 
          id: 'l1', 
          text: 'Paso 1: Entra al navegador de Luz Angela. Abre business.facebook.com.' 
        },
        { 
          id: 'l2', 
          text: 'Paso 2: Entra al BM limpio "comprasenunclickco" y cámbiale el nombre a "BÓVEDA-LUZ".' 
        },
        { 
          id: 'l3', 
          text: 'Paso 3: Ve a los BMs tóxicos de Luz. Extrae los WhatsApps (Cuentas -> Cuentas de WhatsApp -> Asignar Socios hacia BÓVEDA-LUZ). Si da error, elimínalo del tóxico y verifícalo de nuevo en BÓVEDA-LUZ.' 
        },
        { 
          id: 'l4', 
          text: 'Paso 4: Extrae los píxeles (Orígenes de datos -> Conjuntos de datos -> Asignar Socios hacia BÓVEDA-LUZ).' 
        },
        { 
          id: 'l5', 
          text: 'Paso 5: Verifica que todos los activos de Luz Angela estén centralizados en BÓVEDA-LUZ. Nunca pautes desde aquí.' 
        }
      ]
    },
    {
      id: 'nelson',
      title: '🛡️ Fase 3: Bóveda Nelson Lopez (MoreLogin)',
      color: '#3b82f6',
      steps: [
        { 
          id: 'n1', 
          text: 'Paso 1: Abre MoreLogin e inicia el perfil de Nelson Lopez.' 
        },
        { 
          id: 'n2', 
          text: 'Paso 2: Como Nelson sí puede crear BMs, ve a business.facebook.com/overview y crea un BM 100% NUEVO llamado "BÓVEDA-NELSON".' 
        },
        { 
          id: 'n3', 
          text: 'Paso 3: Ve a "Información del negocio" y llena todos los datos legales para darle confianza a Facebook.' 
        },
        { 
          id: 'n4', 
          text: 'Paso 4: Si Nelson va a usar WhatsApps para Chatify, añádelos y verifícalos DIRECTAMENTE en este nuevo BM.' 
        }
      ]
    },
    {
      id: 'guerreros',
      title: '⚔️ Fase 4: Despliegue de Guerreros (Cómo Pautar)',
      color: '#06b6d4',
      steps: [
        { 
          id: 'g1', 
          text: 'PAULA: Abre BÓVEDA-PAULA. Ve a Píxeles -> "Asignar Socios" y pon el ID de tus BMs Guerreros (Techshop, myblustore.com). Ahora esos BMs pueden lanzar campañas leyendo el píxel sin ser los dueños.' 
        },
        { 
          id: 'g2', 
          text: 'LUZ ANGELA: Abre BÓVEDA-LUZ. Ve a Píxeles -> "Asignar Socios" y pon el ID de tus BMs Guerreros (Tiendapapaya, Uwashop).' 
        },
        { 
          id: 'g3', 
          text: 'GABRIELA TEGUCHI: Ella opera sola. Entra a su perfil normal, pon tarjeta en su BM "Sophia Recomienda" y pauta. Sus activos viven y mueren con ella.' 
        }
      ]
    },
    {
      id: 'scale',
      title: '🚀 Fase 5: Regla de Escalabilidad (Nuevos Perfiles)',
      color: '#f59e0b',
      steps: [
        { id: 's1', text: '1. Compras perfil antidetect y lo pones en MoreLogin.' },
        { id: 's2', text: '2. Creas "BÓVEDA-[NOMBRE]". Creas píxeles y WhatsApps y los conectas a Chatify/Shopyeasy.' },
        { id: 's3', text: '3. Creas 2 BMs "Guerreros". Desde la Bóveda, les compartes el píxel como Socio.' },
        { id: 's4', text: '4. Pones tarjeta a los guerreros y pautas. ¡Ciclo infinito y 100% seguro!' }
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
          Sigue estas instrucciones al pie de la letra. Cada paso tiene la ruta exacta de dónde hacer clic en Facebook Business Manager.
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
