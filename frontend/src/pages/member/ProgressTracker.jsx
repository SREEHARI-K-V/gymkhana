import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useFetch } from '../../hooks/useFetch';
import { useNotification } from '../../context/NotificationContext';
import api from '../../services/api';
import { SkeletonLoader } from '../../components/SkeletonLoader';
import { ProgressAnalyticsChart } from '../../components/ProgressAnalyticsChart';
import { Modal } from '../../components/Modal';
import { FiPlus, FiTrendingDown, FiActivity } from 'react-icons/fi';

export const ProgressTracker = () => {
  const { user } = useAuth();
  const memberId = user?.member_id;

  const { data, loading, refetch } = useFetch(`/progress/analytics/${memberId}`, !!memberId);
  const { addToast } = useNotification();

  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    record_date: new Date().toISOString().split('T')[0],
    weight: 75.0,
    body_fat_pct: 18.0,
    chest_in: 38.0,
    waist_in: 32.0,
    arms_in: 14.0,
    notes: 'Self progress log check-in.'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/progress', { ...formData, member_id: memberId });
      addToast('Progress log created & BMI computed!', 'success');
      setModalOpen(false);
      refetch();
    } catch (err) {
      addToast(err.response?.data?.message || 'Error logging progress', 'danger');
    }
  };

  if (loading) return <SkeletonLoader count={2} height="150px" />;

  const analytics = data?.analytics || {};
  const latest = analytics.latest || {};

  return (
    <div className="d-flex flex-column gap-4">
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3">
        <div>
          <h3 className="text-white font-weight-bold mb-1">Body Progress & Analytics</h3>
          <p className="text-muted mb-0">Track body weight, BMI trends, and physical measurement changes over time.</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="btn btn-primary-gradient d-flex align-items-center gap-2"
        >
          <FiPlus size={18} />
          <span>Log Weight & Metrics</span>
        </button>
      </div>

      {/* Latest Metrics Quick Cards */}
      <div className="row g-3">
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="glass-card p-4">
            <span className="text-muted small text-uppercase fw-semibold">Current Weight</span>
            <h2 className="text-white font-weight-bold my-1">{latest.weight ? `${latest.weight} kg` : 'N/A'}</h2>
            <small className="text-cyan">Recorded on {latest.record_date || 'N/A'}</small>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="glass-card p-4">
            <span className="text-muted small text-uppercase fw-semibold">Computed BMI</span>
            <h2 className="text-cyan font-weight-bold my-1">{latest.bmi ? latest.bmi : 'N/A'}</h2>
            <small className="text-muted">Auto-computed from height</small>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="glass-card p-4">
            <span className="text-muted small text-uppercase fw-semibold">Body Fat %</span>
            <h2 className="text-success font-weight-bold my-1">{latest.body_fat_pct ? `${latest.body_fat_pct}%` : 'N/A'}</h2>
            <small className="text-muted">Target fitness level</small>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="glass-card p-4">
            <span className="text-muted small text-uppercase fw-semibold">Total Logged Check-ins</span>
            <h2 className="text-warning font-weight-bold my-1">{analytics.total_logs || 0}</h2>
            <small className="text-muted">Consistent tracking</small>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="glass-card-static p-4">
        <h4 className="text-white font-weight-bold mb-3 d-flex align-items-center gap-2">
          <FiTrendingDown className="text-cyan" /> Historical Progress Visualization
        </h4>
        <ProgressAnalyticsChart
          labels={analytics.labels}
          weightData={analytics.weight_trend}
          bmiData={analytics.bmi_trend}
        />
      </div>

      {/* Modal: Log Metrics */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Log Today's Body Metrics"
      >
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-6">
            <label className="form-label text-muted small fw-semibold">Record Date</label>
            <input
              type="date"
              className="form-control glass-input"
              value={formData.record_date}
              onChange={(e) => setFormData({ ...formData, record_date: e.target.value })}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label text-muted small fw-semibold">Weight (kg)</label>
            <input
              type="number"
              step="0.1"
              className="form-control glass-input"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) })}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label text-muted small fw-semibold">Body Fat %</label>
            <input
              type="number"
              step="0.1"
              className="form-control glass-input"
              value={formData.body_fat_pct}
              onChange={(e) => setFormData({ ...formData, body_fat_pct: parseFloat(e.target.value) })}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label text-muted small fw-semibold">Waist (inches)</label>
            <input
              type="number"
              step="0.1"
              className="form-control glass-input"
              value={formData.waist_in}
              onChange={(e) => setFormData({ ...formData, waist_in: parseFloat(e.target.value) })}
            />
          </div>
          <div className="col-12">
            <label className="form-label text-muted small fw-semibold">Personal Notes</label>
            <textarea
              className="form-control glass-input"
              rows="2"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>
          <div className="col-12 d-flex justify-content-end gap-2 mt-3">
            <button
              type="button"
              className="btn btn-secondary-glass"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary-gradient">
              Save Check-in
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
