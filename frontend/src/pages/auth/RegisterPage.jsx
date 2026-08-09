import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../context/NotificationContext';
import { FiActivity, FiUser, FiMail, FiLock, FiPhone, FiCalendar, FiArrowRight } from 'react-icons/fi';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    phone: '',
    gender: 'MALE',
    date_of_birth: '',
    emergency_contact: '',
    height_cm: 175
  });
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const { addToast } = useNotification();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await register({ ...formData, role: 'MEMBER' });
      addToast('Registration successful! Please login with your credentials.', 'success');
      navigate('/login');
    } catch (err) {
      addToast(err.response?.data?.message || 'Registration failed. Please try again.', 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center p-4">
      <div className="glass-card p-4 p-sm-5 w-100" style={{ maxWidth: '580px' }}>
        <div className="text-center mb-4">
          <div
            className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
            style={{ width: '56px', height: '56px', background: 'linear-gradient(135deg, #4F46E5, #06B6D4)', boxShadow: '0 0 20px rgba(79, 70, 229, 0.5)' }}
          >
            <FiActivity color="#FFF" size={28} />
          </div>
          <h3 className="text-white font-weight-bold">Join Gymkhana Today</h3>
          <p className="text-muted small">Create your member account to start tracking workouts & diets</p>
        </div>

        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-12">
            <label className="form-label text-muted small fw-semibold">Full Name</label>
            <div className="position-relative">
              <FiUser className="position-absolute top-50 translate-middle-y ms-3 text-muted" size={18} />
              <input
                type="text"
                name="full_name"
                className="form-control glass-input ps-5"
                placeholder="John Doe"
                value={formData.full_name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="col-md-6">
            <label className="form-label text-muted small fw-semibold">Email Address</label>
            <div className="position-relative">
              <FiMail className="position-absolute top-50 translate-middle-y ms-3 text-muted" size={18} />
              <input
                type="email"
                name="email"
                className="form-control glass-input ps-5"
                placeholder="name@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="col-md-6">
            <label className="form-label text-muted small fw-semibold">Password</label>
            <div className="position-relative">
              <FiLock className="position-absolute top-50 translate-middle-y ms-3 text-muted" size={18} />
              <input
                type="password"
                name="password"
                className="form-control glass-input ps-5"
                placeholder="Minimum 6 chars"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="col-md-6">
            <label className="form-label text-muted small fw-semibold">Phone Number</label>
            <div className="position-relative">
              <FiPhone className="position-absolute top-50 translate-middle-y ms-3 text-muted" size={18} />
              <input
                type="tel"
                name="phone"
                className="form-control glass-input ps-5"
                placeholder="+1-555-0199"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="col-md-6">
            <label className="form-label text-muted small fw-semibold">Gender</label>
            <select
              name="gender"
              className="form-select glass-input"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="MALE" style={{ background: '#0F172A' }}>Male</option>
              <option value="FEMALE" style={{ background: '#0F172A' }}>Female</option>
              <option value="OTHER" style={{ background: '#0F172A' }}>Other</option>
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label text-muted small fw-semibold">Date of Birth</label>
            <div className="position-relative">
              <FiCalendar className="position-absolute top-50 translate-middle-y ms-3 text-muted" size={18} />
              <input
                type="date"
                name="date_of_birth"
                className="form-control glass-input ps-5"
                value={formData.date_of_birth}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="col-md-6">
            <label className="form-label text-muted small fw-semibold">Height (cm)</label>
            <input
              type="number"
              name="height_cm"
              className="form-control glass-input"
              value={formData.height_cm}
              onChange={handleChange}
            />
          </div>

          <div className="col-12 mt-4">
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary-gradient w-100 d-flex align-items-center justify-content-center gap-2"
            >
              {submitting ? 'Registering...' : (
                <>
                  <span>Create Account</span>
                  <FiArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <span className="text-muted small">Already have an account? </span>
          <Link to="/login" className="text-cyan fw-bold text-decoration-none">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
