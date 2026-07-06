import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/globals/Navbar';
import LeftSidebar from '../components/globals/LeftSidebar';

const UnifiedLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Navbar onToggleSidebar={() => setSidebarOpen((p) => !p)} />
      <div className="unified-layout">
        <LeftSidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="unified-content">
          <Outlet />
        </main>
      </div>
      {sidebarOpen && <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />}
    </>
  );
};

export default UnifiedLayout;
