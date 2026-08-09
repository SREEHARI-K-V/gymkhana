import React, { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { useNotification } from '../../context/NotificationContext';
import api from '../../services/api';
import { SkeletonLoader } from '../../components/SkeletonLoader';
import { Modal } from '../../components/Modal';
import { FiPlus, FiUserCheck, FiBriefcase, FiAward, FiUsers } from 'react-icons/fi';

export const ManageTrainers = () => {
  const { data, loading, refetch } = useFetch('/admin/trainers');
  const { addToast } = useNotification();

  const [addModal, setAddModal] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: 'trainer123',
    phone: '',
    specialization: 'General Fitness & Strength',
    bio: 'Certified Gymkhana Fitness Coach',
    experience_years: 3
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', { ...formData, role: 'TRAINER' });
      addToast('Trainer created successfully!', 'success');
      setAddModal(false);
      refetch();
    } catch (err) {
      addToast(err.response?.data?.message || 'Error creating trainer', 'danger');
    }
  };

  const trainers = data?.trainers || [];

  return (
    <div className="d-flex flex-column gap-4">
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3">
        <div>
          <h3 className="text-white font-weight-bold mb-1">Fitness Trainers & Coaches</h3>
          <p className="text-muted mb-0">Manage gym coaches, specializations, and active client capacity.</p>
        </div>
        <button
          onClick={() => setAddModal(true)}
          className="btn btn-primary-gradient d-flex align-items-center gap-2"
        >
          <FiPlus size={18} />
          <span>Add New Trainer</span>
        </button>
      </div>

      {loading ? (
        <SkeletonLoader count={3} height="120px" />
      ) : (
        <div className="row g-4">
          {trainers.map((t) => (
            <div key={t.id} className="col-12 col-md-6 col-lg-4">
              <div className="glass-card p-4 d-flex flex-column justify-content-between h-100">
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white fs-4"
                      style={{ width: '50px', height: '50px', background: 'linear-gradient(135deg, #4F46E5, #06B6D4)' }}
                    >
                      {t.full_name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="badge badge-role d-flex align-items-center gap-1">
                      <FiUsers size={12} />
                      {t.member_count} Assigned Clients
                    </span>
                  </div>

                  <h5 className="text-white font-weight-bold mb-1">{t.full_name}</h5>
                  <small className="text-cyan fw-semibold d-block mb-2">
                    <FiBriefcase className="me-1" />
                    {t.specialization}
                  </small>
                  <p className="text-muted small mb-3" style={{ lineHeight: '1.5' }}>
                    {t.bio}
                  </p>
                </div>

                <div className="pt-3 border-top border-secondary border-opacity-25 d-flex align-items-center justify-content-between text-muted small">
                  <span>
                    <FiAward className="me-1 text-warning" />
                    {t.experience_years} Years Experience
                  </span>
                  <span>{t.email}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Add Trainer */}
      <Modal
        isOpen={addModal}
        onClose={() => setAddModal(false)}
        title="Register New Fitness Trainer"
      >
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-12">
            <label className="form-label text-muted small fw-semibold">Full Name</label>
            <input
              type="text"
              name="full_name"
              className="form-control glass-input"
              value={formData.full_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label text-muted small fw-semibold">Email Address</label>
            <input
              type="email"
              name="email"
              className="form-control glass-input"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label text-muted small fw-semibold">Password</label>
            <input
              type="password"
              name="password"
              className="form-control glass-input"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label text-muted small fw-semibold">Specialization</label>
            <input
              type="text"
              name="specialization"
              className="form-control glass-input"
              placeholder="e.g. HIIT & Fat Loss"
              value={formData.specialization}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label text-muted small fw-semibold">Experience (Years)</label>
            <input
              type="number"
              name="experience_years"
              className="form-control glass-input"
              value={formData.experience_years}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-12">
            <label className="form-label text-muted small fw-semibold">Bio / Coaching Focus</label>
            <textarea
              name="bio"
              className="form-control glass-input"
              rows="3"
              value={formData.bio}
              onChange={handleChange}
            />
          </div>
          <div className="col-12 d-flex justify-content-end gap-2 mt-3">
            <button
              type="button"
              className="btn btn-secondary-glass"
              onClick={() => setAddModal(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary-gradient">
              Register Trainer
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
