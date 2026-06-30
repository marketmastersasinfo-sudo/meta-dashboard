import React from 'react';
import CorrelationGraph from '../components/CorrelationGraph';

const CorrelationMap = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ marginBottom: '12px' }}>
        <h1 className="page-title" style={{ marginBottom: '4px' }}>🧠 Mapa Mental de Correlaciones</h1>
        <p className="page-subtitle" style={{ margin: 0 }}>
          Explora los "Hilos de la Muerte". Haz hover sobre los nodos para ver detalles. Haz clic para hacer zoom. Filtra por perfil o muestra/oculta cuentas publicitarias.
        </p>
      </div>
      <CorrelationGraph />
    </div>
  );
};

export default CorrelationMap;
