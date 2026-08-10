import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  FiGrid, FiUsers, FiUserCheck, FiCreditCard, FiActivity, 
  FiPieChart, FiFolder, FiLogOut, FiCalendar, FiTarget, FiMapPin 
} from 'react-icons/fi';

export const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useAuth();
  if (!user) return null;

  const role = user.role;

  const adminLinks = [
    { to: '/admin', label: 'Dashboard', icon: FiGrid },
    { to: '/admin/members', label: 'Members', icon: FiUsers },
    { to: '/admin/trainers', label: 'Trainers', icon: FiUserCheck },
    { to: '/admin/plans', label: 'Subscription Plans', icon: FiCreditCard },
    { to: '/admin/templates', label: 'Workout & Diet Templates', icon: FiFolder },
  ];

  const trainerLinks = [
    { to: '/trainer', label: 'Dashboard', icon: FiGrid },
    { to: '/trainer/members', label: 'My Members', icon: FiUsers },
    { to: '/trainer/workout-builder', label: 'Workout Planner', icon: FiActivity },
    { to: '/trainer/diet-builder', label: 'Diet Builder', icon: FiPieChart },
  ];

  const memberLinks = [
    { to: '/member', label: 'My Dashboard', icon: FiGrid },
    { to: '/member/gyms', label: 'Gym Locations & Booking', icon: FiMapPin },
    { to: '/member/tracker', label: "Today's Checklist", icon: FiCalendar },
    { to: '/member/subscription', label: 'My Subscription', icon: FiCreditCard },
    { to: '/member/workout', label: 'Workout Routine', icon: FiActivity },
    { to: '/member/diet', label: 'Diet Plan', icon: FiPieChart },
    { to: '/member/progress', label: 'Body Progress Logs', icon: FiTarget },
  ];

  const links = role === 'ADMIN' ? adminLinks : role === 'TRAINER' ? trainerLinks : memberLinks;

  return (
    <aside
      className={`glass-sidebar d-flex flex-column p-3 position-fixed top-0 bottom-0 start-0 z-3 transition-all ${
        isOpen ? 'translate-x-0' : 'translate-x-negative'
      }`}
      style={{
        width: '260px',
        borderRight: '1px solid var(--border-glass)'
      }}
    >
      {/* Brand logo */}
      <div className="d-flex align-items-center gap-3 px-2 py-3 mb-3 border-bottom border-secondary border-opacity-25">
        <div
          className="d-flex align-items-center justify-content-center rounded-3"
          style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #4F46E5, #06B6D4)' }}
        >
          <FiActivity color="#FFF" size={24} />
        </div>
        <div>
          <h5 className="mb-0 text-white font-weight-bold tracking-wide">GYMKHANA</h5>
          <small className="text-muted" style={{ fontSize: '0.7rem' }}>SaaS SaaS Platform</small>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="nav flex-column gap-1 flex-grow-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/admin' || link.to === '/trainer' || link.to === '/member'}
              className={({ isActive }) =>
                `nav-link d-flex align-items-center gap-3 px-3 py-25 rounded-3 transition-all ${
                  isActive
                    ? 'bg-primary bg-opacity-25 text-white fw-bold border border-primary border-opacity-50'
                    : 'text-muted hover-white hover-glass'
                }`
              }
              style={{ fontSize: '0.92rem' }}
            >
              <Icon size={18} />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User profile & Logout footer */}
      <div className="pt-3 border-top border-secondary border-opacity-25">
        <div className="d-flex align-items-center justify-content-between px-2">
          <div className="d-flex align-items-center gap-2 overflow-hidden">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white bg-indigo"
              style={{ width: '36px', height: '36px', background: '#4F46E5' }}
            >
              {user.full_name?.charAt(0).toUpperCase()}
            </div>
            <div className="text-truncate">
              <span className="d-block text-white fw-semibold text-truncate" style={{ fontSize: '0.85rem' }}>
                {user.full_name}
              </span>
              <span className="badge badge-role" style={{ fontSize: '0.65rem' }}>
                {user.role}
              </span>
            </div>
          </div>
          <button
            onClick={logout}
            className="btn btn-link text-danger p-1"
            title="Logout"
          >
            <FiLogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
};
