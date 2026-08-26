import React from 'react';
import { useFetch } from '../../hooks/useFetch';
import { SkeletonLoader } from '../../components/SkeletonLoader';
import { StatCard } from '../../components/StatCard';
import { FiUsers, FiDollarSign, FiClock, FiUserCheck } from 'react-icons/fi';

export const AdminDashboard = () => {
  const { data, loading, error } = useFetch('/admin/dashboard');

  if (loading) return <SkeletonLoader count={3} height="140px" />;
  if (error) return <div className="alert alert-danger">{error}</div>;

  const stats = data?.stats || {};

  return (
    <div className="d-flex flex-column gap-4">
      {/* Top Header */}
      <div>
        <h3 className="text-white font-weight-bold mb-1">Admin Operations & Analytics</h3>
        <p className="text-muted">Real-time KPI metrics, revenue performance, and gym load status.</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="row g-3">
        <div className="col-12 col-sm-6 col-lg-3">
          <StatCard
            title="Total Members"
            value={stats.total_members || 0}
            icon={FiUsers}
            color="#4F46E5"
            trend="+12%"
          />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <StatCard
            title="Total Revenue"
            value={`$${(stats.total_revenue || 0).toLocaleString()}`}
            icon={FiDollarSign}
            color="#22C55E"
            trend="+18%"
          />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <StatCard
            title="Expiring Soon"
            value={stats.expiring_subscriptions || 0}
            icon={FiClock}
            color="#F59E0B"
            subtitle="Next 7 days"
          />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <StatCard
            title="Active Trainers"
            value={stats.total_trainers || 0}
            icon={FiUserCheck}
            color="#06B6D4"
            subtitle="Coaching members"
          />
        </div>
      </div>

      {/* Analytics Breakdown Row */}
      <div className="row g-4">
        {/* Revenue Growth Trend */}
        <div className="col-12 col-lg-8">
          <div className="glass-card-static p-3 p-sm-4 h-100">
            <h5 className="text-white font-weight-bold mb-3">Revenue Performance Trend</h5>
            <div className="overflow-x-auto hide-scrollbar">
              <div style={{ height: '240px', minWidth: '280px' }} className="d-flex align-items-end justify-content-between gap-2 gap-sm-3 pt-4 px-1 px-sm-3">
                {(stats.revenue_trend?.months || []).map((m, idx) => {
                  const rev = stats.revenue_trend?.revenue?.[idx] || 1000;
                  const maxRev = 12000;
                  const pct = Math.min(100, Math.max(15, (rev / maxRev) * 100));
                  return (
                    <div key={m} className="d-flex flex-column align-items-center flex-grow-1 h-100 justify-content-end" style={{ minWidth: '36px' }}>
                      <small className="text-cyan fw-bold mb-2" style={{ fontSize: '0.75rem' }}>
                        ${rev >= 1000 ? `${(rev/1000).toFixed(1)}k` : rev}
                      </small>
                      <div
                        className="w-100 rounded-top"
                        style={{
                          height: `${pct}%`,
                          background: 'linear-gradient(180deg, #4F46E5 0%, #06B6D4 100%)',
                          boxShadow: '0 0 12px rgba(79, 70, 229, 0.4)',
                          transition: 'height 0.5s ease',
                          minWidth: '16px',
                          maxWidth: '48px'
                        }}
                      />
                      <span className="text-muted mt-2 small fw-semibold" style={{ fontSize: '0.75rem' }}>{m}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Membership Breakdown */}
        <div className="col-12 col-lg-4">
          <div className="glass-card-static p-3 p-sm-4 h-100">
            <h5 className="text-white font-weight-bold mb-3">Subscription Distribution</h5>
            <div className="d-flex flex-column gap-3">
              {(stats.plan_breakdown || []).map((plan) => (
                <div key={plan.plan_id} className="p-3 glass-card rounded-3">
                  <div className="d-flex align-items-center justify-content-between mb-1">
                    <span className="text-white fw-bold">{plan.title}</span>
                    <span className="badge badge-active">{plan.subscriber_count} Members</span>
                  </div>
                  <div className="progress" style={{ height: '6px', background: 'rgba(255,255,255,0.08)' }}>
                    <div
                      className="progress-bar bg-cyan"
                      style={{ width: `${Math.min(100, (plan.subscriber_count / (stats.total_members || 1)) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Trainer Load Capacity */}
      <div className="glass-card-static p-3 p-sm-4">
        <h5 className="text-white font-weight-bold mb-3">Trainer Coaching Load</h5>
        <div className="row g-3">
          {(stats.trainer_load || []).map((t) => (
            <div key={t.trainer_id} className="col-12 col-sm-6 col-lg-4">
              <div className="p-3 glass-card rounded-3 d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="text-white font-weight-bold mb-0">{t.trainer_name}</h6>
                  <small className="text-muted d-block">{t.specialization}</small>
                </div>
                <div className="text-end">
                  <span className="badge badge-role">{t.assigned_members_count} Clients</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
