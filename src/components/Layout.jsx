import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Shield, LayoutDashboard, ShieldCheck, Activity } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        <Shield className="text-accent-primary" size={32} />
        <span>MarlinGuard</span>
      </div>
      <nav className="sidebar-nav">
        <NavLink 
          to="/" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          end
        >
          <LayoutDashboard size={20} />
          <span>Estructura Global</span>
        </NavLink>
        <NavLink 
          to="/meta" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <ShieldCheck size={20} />
          <span>Contingencia Meta</span>
        </NavLink>
        <NavLink 
          to="/tiktok" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <Activity size={20} />
          <span>Contingencia TikTok</span>
        </NavLink>
        <div style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid var(--border-color)' }}>
          <NavLink 
            to="/admin" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            style={{ color: 'var(--warning)' }}
          >
            <Shield size={20} />
            <span style={{ fontWeight: '600' }}>Panel de Control</span>
          </NavLink>
        </div>
      </nav>
    </div>
  );
};

const Header = () => {
  return (
    <header className="header">
      <div style={{ color: 'var(--text-secondary)' }}>
        Sistema de Protección de Activos
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div className="badge badge-success">
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'currentColor', display: 'inline-block' }}></span>
          Sistema Activo
        </div>
        <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--bg-tertiary)' }}></div>
      </div>
    </header>
  );
};

const Layout = () => {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Header />
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
