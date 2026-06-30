import React from 'react';
import ContingencyVisualizer from '../components/ContingencyVisualizer';

const MetaContingency = () => {
  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 className="page-title">Mapa Visual de Contingencia Meta</h1>
        <p className="page-subtitle">Visualiza la estructura de tus activos agrupados por zonas de riesgo (Metodología Media Buying).</p>
      </div>

      <ContingencyVisualizer />
    </div>
  );
};

export default MetaContingency;
