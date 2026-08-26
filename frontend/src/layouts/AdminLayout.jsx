import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';

export const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 992);
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 992);

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 992;
      setIsDesktop(desktop);
      if (!desktop && sidebarOpen) {
        setSidebarOpen(false);
      } else if (desktop && !sidebarOpen) {
        setSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="d-flex min-vh-100 position-relative w-100 overflow-x-hidden">
      <Sidebar 
        isOpen={sidebarOpen} 
        toggleSidebar={() => setSidebarOpen(prev => !prev)} 
        closeSidebar={() => setSidebarOpen(false)}
      />
      <div 
        className="main-content-layout flex-grow-1 d-flex flex-column w-100" 
        style={{ 
          marginLeft: isDesktop && sidebarOpen ? '260px' : '0px', 
          transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          minWidth: 0
        }}
      >
        <Navbar toggleSidebar={() => setSidebarOpen(prev => !prev)} />
        <main className="p-3 p-sm-4 flex-grow-1 w-100" style={{ maxWidth: '1600px', margin: '0 auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

