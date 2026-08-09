import React from 'react';

export const StatCard = ({ title, value, icon: Icon, color = 'var(--primary)', subtitle, trend }) => {
  return (
    <div className="glass-card p-4 d-flex align-items-center justify-content-between">
      <div>
        <span className="text-muted fw-semibold text-uppercase" style={{ fontSize: '0.78rem', letterSpacing: '1px' }}>
          {title}
        </span>
        <h2 className="mb-0 mt-2 font-weight-bold" style={{ fontSize: '1.85rem' }}>{value}</h2>
        {subtitle && <small className="text-muted mt-1 d-block">{subtitle}</small>}
        {trend && (
          <small className={`fw-semibold mt-1 d-inline-block ${trend.startsWith('+') ? 'text-success' : 'text-danger'}`}>
            {trend} from last month
          </small>
        )}
      </div>
      <div
        className="d-flex align-items-center justify-content-center rounded-circle"
        style={{
          width: '54px',
          height: '54px',
          background: `rgba(255, 255, 255, 0.05)`,
          border: `1px solid ${color}`,
          boxShadow: `0 0 16px ${color}40`,
          color: color
        }}
      >
        <Icon size={26} />
      </div>
    </div>
  );
};
