import React from 'react';
import { useFetch } from '../../hooks/useFetch';
import { SkeletonLoader } from '../../components/SkeletonLoader';
import { FiCreditCard, FiClock, FiCheckCircle, FiShield } from 'react-icons/fi';

export const MySubscription = () => {
  const { data, loading } = useFetch('/member/subscription');

  if (loading) return <SkeletonLoader count={2} height="150px" />;

  const sub = data?.current_subscription || {};
  const history = data?.history || [];

  return (
    <div className="d-flex flex-column gap-4">
      <div>
        <h3 className="text-white font-weight-bold mb-1">My Gym Subscription</h3>
        <p className="text-muted mb-0">Subscription status, expiration timers, and payment history.</p>
      </div>

      {/* Active Subscription Highlight */}
      <div className="glass-card p-4 position-relative overflow-hidden">
        <div className="row align-items-center">
          <div className="col-12 col-md-8">
            <span className="badge badge-active mb-2">CURRENT PLAN</span>
            <h2 className="text-white font-weight-bold mb-2">{sub.plan_title || 'No Active Plan'}</h2>
            <p className="text-muted mb-3">
              Start Date: <strong className="text-white">{sub.start_date}</strong> • Expiration Date: <strong className="text-white">{sub.end_date}</strong>
            </p>

            <div className="d-flex align-items-center gap-3">
              {sub.status === 'ACTIVE' && (
                <span className="badge badge-status badge-active fs-6">
                  <FiCheckCircle className="me-1" />
                  ACTIVE & PAID
                </span>
              )}
              {sub.status === 'EXPIRING_SOON' && (
                <span className="badge badge-status badge-expiring fs-6">
                  <FiClock className="me-1" />
                  EXPIRING IN {sub.days_remaining} DAYS
                </span>
              )}
              {(!sub.status || sub.status === 'EXPIRED') && (
                <span className="badge badge-status badge-expired fs-6">EXPIRED</span>
              )}

              <span className="text-cyan fw-bold fs-5">${sub.payment_amount} / {sub.duration_months} month(s)</span>
            </div>
          </div>

          <div className="col-12 col-md-4 text-md-end mt-3 mt-md-0">
            <div className="p-3 glass-card-static rounded-3 d-inline-block text-start">
              <small className="text-muted d-block">Days Remaining</small>
              <h1 className="text-cyan font-weight-bold mb-0">{sub.days_remaining || 0}</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription History */}
      <div className="glass-card-static p-4">
        <h5 className="text-white font-weight-bold mb-3">Subscription & Payment History</h5>
        <div className="table-responsive">
          <table className="table-glass">
            <thead>
              <tr>
                <th>Plan Title</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Amount Paid</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-3 text-muted">No historical subscriptions found.</td>
                </tr>
              ) : (
                history.map((h) => (
                  <tr key={h.id}>
                    <td className="text-white fw-bold">{h.plan_title}</td>
                    <td>{h.start_date}</td>
                    <td>{h.end_date}</td>
                    <td className="text-cyan fw-bold">${h.payment_amount}</td>
                    <td>
                      <span className={`badge badge-status ${h.status === 'ACTIVE' ? 'badge-active' : 'badge-expired'}`}>
                        {h.status}
                      </span>
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
