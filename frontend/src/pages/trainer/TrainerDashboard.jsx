import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { SkeletonLoader } from '../../components/SkeletonLoader';
import { StatCard } from '../../components/StatCard';
import { FiUsers, FiActivity, FiPieChart, FiArrowRight } from 'react-icons/fi';

export const TrainerDashboard = () => {
  const { data, loading, error } = useFetch('/trainer/dashboard');
  const navigate = useNavigate();

  if (loading) return <SkeletonLoader count={2} height="140px" />;
  if (error) return <div className="alert alert-danger">{error}</div>;

  const members = data?.members || [];
  const trainer = data?.trainer || {};

  return (
    <div className="d-flex flex-column gap-4">
      {/* Header */}
      <div className="glass-card p-4 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
        <div>
          <span className="badge badge-role mb-2">{trainer.specialization}</span>
          <h3 className="text-white font-weight-bold mb-1">Coach {trainer.full_name}'s Portal</h3>
          <p className="text-muted mb-0">{trainer.bio || 'Managing assigned member fitness & diet goals.'}</p>
        </div>
        <div className="d-flex gap-2">
          <button
            onClick={() => navigate('/trainer/workout-builder')}
            className="btn btn-primary-gradient d-flex align-items-center gap-2"
          >
            <FiActivity size={18} />
            <span>Create Workout Plan</span>
          </button>
          <button
            onClick={() => navigate('/trainer/diet-builder')}
            className="btn btn-cyan-gradient d-flex align-items-center gap-2"
          >
            <FiPieChart size={18} />
            <span>Create Diet Plan</span>
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="row g-3">
        <div className="col-12 col-md-4">
          <StatCard
            title="Assigned Clients"
            value={data?.assigned_members_count || 0}
            icon={FiUsers}
            color="#4F46E5"
            subtitle="Active members under supervision"
          />
        </div>
        <div className="col-12 col-md-4">
          <StatCard
            title="Master Workout Templates"
            value={data?.workout_templates_count || 0}
            icon={FiActivity}
            color="#06B6D4"
            subtitle="Available to duplicate & assign"
          />
        </div>
        <div className="col-12 col-md-4">
          <StatCard
            title="Master Diet Templates"
            value={data?.diet_templates_count || 0}
            icon={FiPieChart}
            color="#22C55E"
            subtitle="Ready macronutrient plans"
          />
        </div>
      </div>

      {/* Assigned Members Quick View */}
      <div className="glass-card-static p-4">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h4 className="text-white font-weight-bold mb-0">Assigned Member Roster</h4>
          <button
            onClick={() => navigate('/trainer/members')}
            className="btn btn-secondary-glass btn-sm d-flex align-items-center gap-1"
          >
            <span>View All Roster</span>
            <FiArrowRight size={14} />
          </button>
        </div>

        <div className="table-responsive">
          <table className="table-glass">
            <thead>
              <tr>
                <th>Member Name</th>
                <th>Contact</th>
                <th>Subscription</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {members.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-muted">
                    No members assigned to your profile yet.
                  </td>
                </tr>
              ) : (
                members.map((m) => (
                  <tr key={m.id}>
                    <td>
                      <span className="text-white fw-bold d-block">{m.full_name}</span>
                      <small className="text-muted">{m.gender || 'Gender N/A'} • Height {m.height_cm}cm</small>
                    </td>
                    <td>{m.email}</td>
                    <td>
                      <span className="badge badge-active">{m.plan_title}</span>
                    </td>
                    <td>
                      <button
                        onClick={() => navigate(`/trainer/member/${m.id}/progress`)}
                        className="btn btn-secondary-glass btn-sm"
                      >
                        Inspect Progress & Plans
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
