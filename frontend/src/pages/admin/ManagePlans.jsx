import React, { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { useNotification } from '../../context/NotificationContext';
import api from '../../services/api';
import { SkeletonLoader } from '../../components/SkeletonLoader';
import { Modal } from '../../components/Modal';
import { FiPlus, FiCheckCircle, FiClock, FiDollarSign } from 'react-icons/fi';

export const ManagePlans = () => {
  const { data, loading, refetch } = useFetch('/plans/all');
  const { addToast } = useNotification();

  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    duration_months: 1,
    price: 49.99,
    features: ['Access to Gym Equipment', 'Locker Access', 'Personal Fitness Consultation']
  });
  const [featureInput, setFeatureInput] = useState('');

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFormData({ ...formData, features: [...formData.features, featureInput.trim()] });
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (idx) => {
    const updated = formData.features.filter((_, i) => i !== idx);
    setFormData({ ...formData, features: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/plans', formData);
      addToast('Subscription plan created successfully!', 'success');
      setModalOpen(false);
      refetch();
    } catch (err) {
      addToast(err.response?.data?.message || 'Error creating plan', 'danger');
    }
  };

  const plans = data?.plans || [];

  return (
    <div className="d-flex flex-column gap-4">
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3">
        <div>
          <h3 className="text-white font-weight-bold mb-1">Subscription Tier Plans</h3>
          <p className="text-muted mb-0">Define pricing tiers, features, and durations for members.</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="btn btn-primary-gradient d-flex align-items-center gap-2"
        >
          <FiPlus size={18} />
          <span>Create New Tier Plan</span>
        </button>
      </div>

      {loading ? (
        <SkeletonLoader count={3} height="200px" />
      ) : (
        <div className="row g-4">
          {plans.map((p) => (
            <div key={p.id} className="col-12 col-md-6 col-lg-3">
              <div className="glass-card p-4 d-flex flex-column justify-content-between h-100 position-relative">
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <span className="badge badge-active">{p.duration_months} Month(s)</span>
                    <span className="text-muted small">ID #{p.id}</span>
                  </div>

                  <h4 className="text-white font-weight-bold mb-2">{p.title}</h4>
                  <div className="d-flex align-items-baseline gap-1 my-3">
                    <h2 className="text-cyan font-weight-bold mb-0">${p.price}</h2>
                    <span className="text-muted small">/ period</span>
                  </div>

                  <hr className="border-secondary opacity-25 my-3" />

                  <ul className="list-unstyled d-flex flex-column gap-2 mb-0" style={{ fontSize: '0.88rem' }}>
                    {p.features?.map((feat, idx) => (
                      <li key={idx} className="d-flex align-items-start gap-2 text-muted">
                        <FiCheckCircle color="#22C55E" size={16} className="mt-1 flex-shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Create Plan */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create Subscription Plan"
      >
        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
          <div>
            <label className="form-label text-muted small fw-semibold">Plan Title</label>
            <input
              type="text"
              className="form-control glass-input"
              placeholder="e.g. Pro Performance Plan"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="row g-3">
            <div className="col-6">
              <label className="form-label text-muted small fw-semibold">Duration (Months)</label>
              <input
                type="number"
                className="form-control glass-input"
                min="1"
                max="36"
                value={formData.duration_months}
                onChange={(e) => setFormData({ ...formData, duration_months: parseInt(e.target.value) })}
                required
              />
            </div>
            <div className="col-6">
              <label className="form-label text-muted small fw-semibold">Price ($ USD)</label>
              <input
                type="number"
                step="0.01"
                className="form-control glass-input"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                required
              />
            </div>
          </div>

          <div>
            <label className="form-label text-muted small fw-semibold">Plan Features & Perks</label>
            <div className="d-flex gap-2 mb-2">
              <input
                type="text"
                className="form-control glass-input"
                placeholder="e.g. Sauna & Guest Passes"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-secondary-glass flex-shrink-0"
                onClick={handleAddFeature}
              >
                Add Feature
              </button>
            </div>

            <div className="d-flex flex-wrap gap-2 mt-2">
              {formData.features.map((feat, idx) => (
                <span
                  key={idx}
                  className="badge glass-card-static px-3 py-2 text-white d-flex align-items-center gap-2"
                >
                  {feat}
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    style={{ fontSize: '0.65rem' }}
                    onClick={() => handleRemoveFeature(idx)}
                  />
                </span>
              ))}
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2 mt-4">
            <button
              type="button"
              className="btn btn-secondary-glass"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary-gradient">
              Publish Plan
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
