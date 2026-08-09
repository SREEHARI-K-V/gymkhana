import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { FiMenu, FiBell, FiUser } from 'react-icons/fi';

export const Navbar = ({ toggleSidebar }) => {
  const { user } = useAuth();

  return (
    <header className="glass-navbar sticky-top px-4 py-3 d-flex align-items-center justify-content-between">
      <div className="d-flex align-items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="btn btn-secondary-glass d-md-none p-2"
        >
          <FiMenu size={20} />
        </button>
        <div>
          <h5 className="mb-0 text-white font-weight-bold">
            Welcome back, {user?.full_name || 'User'} 👋
          </h5>
          <small className="text-muted" style={{ fontSize: '0.8rem' }}>
            Gymkhana SaaS • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
          </small>
        </div>
      </div>

      <div className="d-flex align-items-center gap-3">
        <div className="position-relative">
          <button className="btn btn-secondary-glass p-2 position-relative rounded-circle">
            <FiBell size={18} />
            <span
              className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"
              style={{ width: '8px', height: '8px' }}
            />
          </button>
        </div>

        <div className="d-none d-sm-flex align-items-center gap-2 px-3 py-15 glass-card-static rounded-pill">
          <FiUser size={16} className="text-cyan" />
          <span className="text-white fw-semibold" style={{ fontSize: '0.85rem' }}>
            {user?.role} MODE
          </span>
        </div>
      </div>
    </header>
  );
};
