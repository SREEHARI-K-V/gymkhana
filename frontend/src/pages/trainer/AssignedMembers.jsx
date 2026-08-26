import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { SkeletonLoader } from '../../components/SkeletonLoader';
import { FiUserCheck, FiActivity, FiPieChart, FiArrowRight } from 'react-icons/fi';

export const AssignedMembers = () => {
  const { data, loading } = useFetch('/trainer/members');
  const navigate = useNavigate();

  const members = data?.members || [];

  return (
    <div className="d-flex flex-column gap-4">
      <div>
        <h3 className="text-white font-weight-bold mb-1">My Assigned Members</h3>
        <p className="text-muted mb-0">Strict database-level filter showing only your assigned clients.</p>
      </div>

      {loading ? (
        <SkeletonLoader count={3} height="100px" />
      ) : (
        <div className="row g-3 g-md-4">
          {members.length === 0 ? (
            <div className="col-12 glass-card-static p-4 text-center text-muted">
              You currently have no members assigned. Ask Admin to assign members to your roster.
            </div>
          ) : (
            members.map((m) => (
              <div key={m.id} className="col-12 col-sm-6 col-lg-4">
                <div className="glass-card p-4 d-flex flex-column justify-content-between h-100">
                  <div>
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white fs-4"
                        style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #4F46E5, #06B6D4)' }}
                      >
                        {m.full_name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="badge badge-active">{m.subscription_status}</span>
                    </div>

                    <h5 className="text-white font-weight-bold mb-1">{m.full_name}</h5>
                    <small className="text-muted d-block mb-3">{m.email} • {m.phone || 'No Phone'}</small>

                    <div className="p-3 glass-card-static rounded-3 mb-3 text-muted small">
                      <div className="d-flex justify-content-between mb-1">
                        <span>Current Plan:</span>
                        <strong className="text-cyan">{m.plan_title}</strong>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span>Height:</span>
                        <strong className="text-white">{m.height_cm} cm</strong>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/trainer/member/${m.id}/progress`)}
                    className="btn btn-primary-gradient w-100 d-flex align-items-center justify-content-center gap-2"
                  >
                    <span>View Member Hub</span>
                    <FiArrowRight size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
