import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import MetaContingency from './pages/MetaContingency';
import TikTokContingency from './pages/TikTokContingency';
import AdminPanel from './pages/AdminPanel';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="meta" element={<MetaContingency />} />
          <Route path="tiktok" element={<TikTokContingency />} />
          <Route path="admin" element={<AdminPanel />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
