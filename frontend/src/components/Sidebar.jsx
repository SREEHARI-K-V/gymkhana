import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  FiGrid, FiUsers, FiUserCheck, FiCreditCard, FiActivity, 
  FiPieChart, FiFolder, FiLogOut, FiCalendar, FiTarget, FiMapPin, FiX 
} from 'react-icons/fi';

export const Sidebar = ({ isOpen, toggleSidebar, closeSidebar }) => {
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
    { to: '/member/gyms', label: 'Gym Centers & Booking', icon: FiMapPin },
    { to: '/member/tracker', label: "Today's Checklist", icon: FiCalendar },
    { to: '/member/subscription', label: 'My Subscription', icon: FiCreditCard },
    { to: '/member/workout', label: 'Workout Routine', icon: FiActivity },
    { to: '/member/diet', label: 'Diet Plan', icon: FiPieChart },
    { to: '/member/progress', label: 'Body Progress Logs', icon: FiTarget },
  ];

  const links = role === 'ADMIN' ? adminLinks : role === 'TRAINER' ? trainerLinks : memberLinks;

  const handleLinkClick = () => {
    if (closeSidebar && window.innerWidth < 992) {
      closeSidebar();
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <div 
        className={`sidebar-backdrop ${isOpen ? 'show' : ''}`}
        onClick={closeSidebar}
        aria-hidden="true"
      />

      <aside
        className={`glass-sidebar d-flex flex-column p-3 ${
          isOpen ? 'sidebar-open' : 'sidebar-closed'
        }`}
      >
        {/* Brand logo & mobile close button */}
        <div className="d-flex align-items-center justify-content-between px-2 py-2 mb-3 border-bottom border-secondary border-opacity-25">
          <div className="d-flex align-items-center gap-3">
            <div
              className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
              style={{ width: '38px', height: '38px', background: 'linear-gradient(135deg, #4F46E5, #06B6D4)' }}
            >
              <FiActivity color="#FFF" size={22} />
            </div>
            <div>
              <h5 className="mb-0 text-white fw-bold tracking-wide" style={{ fontSize: '1.05rem' }}>GYMKHANA</h5>
              <small className="text-muted d-block" style={{ fontSize: '0.68rem' }}>SaaS Platform</small>
            </div>
          </div>

          <button
            onClick={closeSidebar || toggleSidebar}
            className="btn btn-link text-muted d-lg-none p-1 hover-white"
            aria-label="Close Sidebar"
          >
            <FiX size={22} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="nav flex-column gap-1 flex-grow-1 overflow-y-auto hide-scrollbar py-2">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/admin' || link.to === '/trainer' || link.to === '/member'}
                onClick={handleLinkClick}
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-3 px-3 py-2 rounded-3 transition-all ${
                    isActive
                      ? 'bg-primary bg-opacity-25 text-white fw-bold border border-primary border-opacity-50'
                      : 'text-muted hover-white hover-glass'
                  }`
                }
                style={{ fontSize: '0.9rem' }}
              >
                <Icon size={18} className="flex-shrink-0" />
                <span className="text-truncate">{link.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User profile & Logout footer */}
        <div className="pt-3 mt-auto border-top border-secondary border-opacity-25">
          <div className="d-flex align-items-center justify-content-between px-2">
            <div className="d-flex align-items-center gap-2 overflow-hidden">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white flex-shrink-0"
                style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #4F46E5, #06B6D4)' }}
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
              className="btn btn-link text-danger p-1 flex-shrink-0"
              title="Logout"
              aria-label="Logout"
            >
              <FiLogOut size={18} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

