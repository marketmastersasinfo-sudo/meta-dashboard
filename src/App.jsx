import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import MetaContingency from './pages/MetaContingency';
import CorrelationMap from './pages/CorrelationMap';
import TikTokContingency from './pages/TikTokContingency';
import AdminPanel from './pages/AdminPanel';
import ActionPlan from './pages/ActionPlan';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="meta" element={<MetaContingency />} />
          <Route path="correlaciones" element={<CorrelationMap />} />
          <Route path="tiktok" element={<TikTokContingency />} />
          <Route path="action-plan" element={<ActionPlan />} />
          <Route path="admin" element={<AdminPanel />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
