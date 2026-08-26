import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { useNotification } from '../../context/NotificationContext';
import api from '../../services/api';
import { SkeletonLoader } from '../../components/SkeletonLoader';
import { ProgressAnalyticsChart } from '../../components/ProgressAnalyticsChart';
import { Modal } from '../../components/Modal';
import { FiArrowLeft, FiPlus, FiActivity, FiPieChart, FiTrendingDown, FiFileText } from 'react-icons/fi';

export const MemberProgressView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, loading, refetch } = useFetch(`/trainer/member/${id}/progress`);
  const { addToast } = useNotification();

  const [logModal, setLogModal] = useState(false);
  const [logForm, setLogForm] = useState({
    record_date: new Date().toISOString().split('T')[0],
    weight: 75.0,
    body_fat_pct: 18.5,
    chest_in: 38.0,
    waist_in: 32.0,
    arms_in: 14.5,
    notes: 'Trainer check-in assessment.'
  });

  const handleLogSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/progress', { ...logForm, member_id: parseInt(id) });
      addToast('Progress metrics logged for member!', 'success');
      setLogModal(false);
      refetch();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to log progress', 'danger');
    }
  };

  if (loading) return <SkeletonLoader count={3} height="150px" />;

  const member = data?.member || {};
  const records = data?.progress_records || [];
  const activeWorkout = data?.active_workout;
  const activeDiet = data?.active_diet;

  const chartLabels = records.map((r) => r.record_date);
  const weightTrend = records.map((r) => r.weight);
  const bmiTrend = records.map((r) => r.bmi);

  return (
    <div className="d-flex flex-column gap-4">
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-2 gap-sm-3">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-secondary-glass d-flex align-items-center justify-content-center gap-2"
        >
          <FiArrowLeft size={18} />
          <span>Back to Assigned Roster</span>
        </button>
        <button
          onClick={() => setLogModal(true)}
          className="btn btn-primary-gradient d-flex align-items-center justify-content-center gap-2"
        >
          <FiPlus size={18} />
          <span>Log Assessment / Weight</span>
        </button>
      </div>

      {/* Member Profile Overview Card */}
      <div className="glass-card p-4 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
        <div className="d-flex align-items-center gap-3">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white fs-3"
            style={{ width: '60px', height: '60px', background: 'linear-gradient(135deg, #4F46E5, #06B6D4)' }}
          >
            {member.full_name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-white font-weight-bold mb-1">{member.full_name}</h3>
            <span className="text-muted small">
              {member.email} • Height: <strong className="text-cyan">{member.height_cm} cm</strong> • Gender: {member.gender || 'N/A'}
            </span>
          </div>
        </div>

        <div className="d-flex align-items-center gap-2">
          <span className="badge badge-active fs-6">{member.subscription_status}</span>
          <span className="badge badge-role fs-6">{member.plan_title}</span>
        </div>
      </div>

      {/* Progress Chart */}
      <div className="glass-card-static p-4">
        <h4 className="text-white font-weight-bold mb-3 d-flex align-items-center gap-2">
          <FiTrendingDown className="text-cyan" /> Body Weight & BMI Analytics
        </h4>
        <ProgressAnalyticsChart labels={chartLabels} weightData={weightTrend} bmiData={bmiTrend} />
      </div>

      {/* Active Workout & Diet Summary */}
      <div className="row g-4">
        <div className="col-12 col-md-6">
          <div className="glass-card-static p-4 h-100">
            <h5 className="text-white font-weight-bold mb-3 d-flex align-items-center gap-2">
              <FiActivity className="text-primary" /> Active Workout Routine
            </h5>
            {activeWorkout ? (
              <div>
                <h6 className="text-cyan font-weight-bold mb-1">{activeWorkout.title}</h6>
                <p className="text-muted small mb-3">{activeWorkout.description}</p>
                <div className="d-flex flex-column gap-2">
                  {(activeWorkout.exercises || []).map((ex) => (
                    <div key={ex.id} className="p-2 glass-card rounded-2 d-flex align-items-center justify-content-between text-muted small">
                      <span className="text-white fw-bold">{ex.day_of_week}: {ex.exercise_name}</span>
                      <span>{ex.sets} sets × {ex.reps} ({ex.target_muscle})</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-muted">No active workout assigned yet.</p>
            )}
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="glass-card-static p-4 h-100">
            <h5 className="text-white font-weight-bold mb-3 d-flex align-items-center gap-2">
              <FiPieChart className="text-success" /> Active Diet Plan
            </h5>
            {activeDiet ? (
              <div>
                <h6 className="text-success font-weight-bold mb-1">{activeDiet.title}</h6>
                <p className="text-muted small mb-3">Daily Target: {activeDiet.daily_calorie_target} kcal/day</p>
                <div className="d-flex flex-column gap-2">
                  {(activeDiet.meals || []).map((m) => (
                    <div key={m.id} className="p-2 glass-card rounded-2 d-flex align-items-center justify-content-between text-muted small">
                      <span className="text-white fw-bold">{m.meal_time}: {m.meal_name}</span>
                      <span className="text-cyan fw-semibold">{m.calories} kcal</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-muted">No active diet assigned yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Assessment Check-in History */}
      <div className="glass-card-static p-4">
        <h5 className="text-white font-weight-bold mb-3">Check-in Assessment History</h5>
        <div className="table-responsive">
          <table className="table-glass">
            <thead>
              <tr>
                <th>Date</th>
                <th>Weight (kg)</th>
                <th>BMI</th>
                <th>Body Fat %</th>
                <th>Chest / Waist / Arms</th>
                <th>Trainer Notes</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-3 text-muted">No progress logs recorded.</td>
                </tr>
              ) : (
                records.map((r) => (
                  <tr key={r.id}>
                    <td className="text-white fw-semibold">{r.record_date}</td>
                    <td className="text-cyan fw-bold">{r.weight} kg</td>
                    <td>{r.bmi || 'N/A'}</td>
                    <td>{r.body_fat_pct ? `${r.body_fat_pct}%` : 'N/A'}</td>
                    <td className="text-muted small">
                      {r.chest_in || '-'}" / {r.waist_in || '-'}" / {r.arms_in || '-'}"
                    </td>
                    <td className="text-muted small">{r.notes || 'No notes'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Log Check-in */}
      <Modal
        isOpen={logModal}
        onClose={() => setLogModal(false)}
        title={`Log Body Metrics for ${member.full_name}`}
      >
        <form onSubmit={handleLogSubmit} className="row g-3">
          <div className="col-12 col-sm-6">
            <label className="form-label text-muted small fw-semibold">Assessment Date</label>
            <input
              type="date"
              className="form-control glass-input"
              value={logForm.record_date}
              onChange={(e) => setLogForm({ ...logForm, record_date: e.target.value })}
              required
            />
          </div>
          <div className="col-12 col-sm-6">
            <label className="form-label text-muted small fw-semibold">Weight (kg)</label>
            <input
              type="number"
              step="0.1"
              className="form-control glass-input"
              value={logForm.weight}
              onChange={(e) => setLogForm({ ...logForm, weight: parseFloat(e.target.value) })}
              required
            />
          </div>
          <div className="col-12 col-sm-6">
            <label className="form-label text-muted small fw-semibold">Body Fat %</label>
            <input
              type="number"
              step="0.1"
              className="form-control glass-input"
              value={logForm.body_fat_pct}
              onChange={(e) => setLogForm({ ...logForm, body_fat_pct: parseFloat(e.target.value) })}
            />
          </div>
          <div className="col-12 col-sm-6">
            <label className="form-label text-muted small fw-semibold">Waist Circumference (inches)</label>
            <input
              type="number"
              step="0.1"
              className="form-control glass-input"
              value={logForm.waist_in}
              onChange={(e) => setLogForm({ ...logForm, waist_in: parseFloat(e.target.value) })}
            />
          </div>
          <div className="col-12">
            <label className="form-label text-muted small fw-semibold">Trainer Coaching Notes</label>
            <textarea
              className="form-control glass-input"
              rows="3"
              value={logForm.notes}
              onChange={(e) => setLogForm({ ...logForm, notes: e.target.value })}
            />
          </div>
          <div className="col-12 d-flex justify-content-end gap-2 mt-3">
            <button
              type="button"
              className="btn btn-secondary-glass"
              onClick={() => setLogModal(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary-gradient">
              Save Log
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
