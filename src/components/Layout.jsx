import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh' }}>
      <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main style={{
        marginTop: 'var(--header-height)',
        marginLeft: 'var(--sidebar-width)',
        minHeight: 'calc(100vh - var(--header-height))',
        transition: 'margin-left var(--transition-base)',
      }}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
