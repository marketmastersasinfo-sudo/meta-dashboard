import React from 'react';
import CorrelationGraph from '../components/CorrelationGraph';

const CorrelationMap = () => {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '16px' }}>
        <h1 className="page-title">Mapa Mental de Correlaciones</h1>
        <p className="page-subtitle">Explora los "Hilos de la Muerte". Arrastra los nodos para ver cómo los BMs comparten activos críticos (WhatsApps y Píxeles).</p>
      </div>

      <div style={{ flex: 1, minHeight: '600px', position: 'relative' }}>
        <CorrelationGraph />
      </div>
    </div>
  );
};

export default CorrelationMap;
