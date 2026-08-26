import React from 'react';

export const StatCard = ({ title, value, icon: Icon, color = 'var(--primary)', subtitle, trend }) => {
  return (
    <div className="glass-card p-3 p-sm-4 d-flex align-items-center justify-content-between gap-2 h-100">
      <div className="text-truncate">
        <span className="text-muted fw-semibold text-uppercase text-truncate d-block" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
          {title}
        </span>
        <h2 className="mb-0 mt-1 mt-sm-2 font-weight-bold text-truncate" style={{ fontSize: 'clamp(1.35rem, 3.5vw, 1.85rem)' }}>
          {value}
        </h2>
        {subtitle && <small className="text-muted mt-1 d-block text-truncate" style={{ fontSize: '0.75rem' }}>{subtitle}</small>}
        {trend && (
          <small className={`fw-semibold mt-1 d-inline-block ${trend.startsWith('+') ? 'text-success' : 'text-danger'}`} style={{ fontSize: '0.75rem' }}>
            {trend} from last month
          </small>
        )}
      </div>
      <div
        className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
        style={{
          width: '48px',
          height: '48px',
          background: `rgba(255, 255, 255, 0.05)`,
          border: `1px solid ${color}`,
          boxShadow: `0 0 16px ${color}40`,
          color: color
        }}
      >
        <Icon size={24} />
      </div>
    </div>
  );
};

