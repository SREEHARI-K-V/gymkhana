import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { FiMenu, FiBell, FiUser } from 'react-icons/fi';

export const Navbar = ({ toggleSidebar, sidebarOpen }) => {
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`glass-navbar sticky-top px-3 px-sm-4 py-2 py-sm-3 d-flex align-items-center justify-content-between ${scrolled ? 'scrolled' : ''}`}>
      <div className="d-flex align-items-center gap-2 gap-sm-3 overflow-hidden">
        <button
          onClick={toggleSidebar}
          className="btn btn-secondary-glass p-2 d-inline-flex align-items-center justify-content-center flex-shrink-0"
          aria-label="Toggle Navigation Menu"
          title={sidebarOpen ? 'Collapse navigation menu' : 'Open navigation menu'}
        >
          <FiMenu size={20} />
        </button>
        <div className="text-truncate">
          <h5 className="mb-0 text-white fw-bold text-truncate" style={{ fontSize: 'clamp(0.95rem, 3vw, 1.15rem)' }}>
            Welcome back, {user?.full_name?.split(' ')[0] || 'User'} 👋
          </h5>
          <small className="text-muted d-none d-sm-block text-truncate" style={{ fontSize: '0.75rem' }}>
            Gymkhana SaaS • {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </small>
        </div>
      </div>

      <div className="d-flex align-items-center gap-2 gap-sm-3 flex-shrink-0">
        <div className="position-relative">
          <button 
            className="btn btn-secondary-glass p-2 position-relative rounded-circle d-inline-flex align-items-center justify-content-center"
            title="Notifications"
            aria-label="Notifications"
          >
            <FiBell size={17} />
            <span
              className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"
              style={{ width: '8px', height: '8px' }}
            />
          </button>
        </div>

        <div className="d-none d-sm-flex align-items-center gap-2 px-3 py-1 glass-card-static rounded-pill">
          <FiUser size={15} className="text-cyan" />
          <span className="text-white fw-semibold" style={{ fontSize: '0.8rem' }}>
            {user?.role}
          </span>
        </div>
      </div>
    </header>
  );
};

