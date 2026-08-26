import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../context/NotificationContext';
import { FiActivity, FiUser, FiMail, FiLock, FiPhone, FiCalendar, FiArrowRight, FiEye, FiEyeOff, FiTarget } from 'react-icons/fi';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    phone: '',
    role: 'MEMBER',
    gender: 'MALE',
    date_of_birth: '',
    emergency_contact: '',
    height_cm: 175,
    weight_kg: 70
  });
  const [showPassword, setShowPassword] = useState(false);
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
      await register({
        ...formData,
        height_cm: parseFloat(formData.height_cm) || 170,
        weight_kg: parseFloat(formData.weight_kg) || 70
      });
      addToast('Registration successful! Please login with your credentials.', 'success');
      navigate('/login');
    } catch (err) {
      addToast(err.response?.data?.message || 'Registration failed. Please try again.', 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center p-3 p-sm-4 position-relative overflow-hidden">
      {/* Background Decorative Ambient Glows */}
      <div
        className="position-absolute rounded-circle"
        style={{
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(79, 70, 229, 0.2) 0%, rgba(0, 0, 0, 0) 70%)',
          top: '-15%',
          right: '-10%',
          filter: 'blur(60px)',
          pointerEvents: 'none'
        }}
      />
      <div
        className="position-absolute rounded-circle"
        style={{
          width: '450px',
          height: '450px',
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.18) 0%, rgba(0, 0, 0, 0) 70%)',
          bottom: '-15%',
          left: '-10%',
          filter: 'blur(60px)',
          pointerEvents: 'none'
        }}
      />

      <div className="glass-card p-4 p-sm-5 w-100 position-relative z-1" style={{ maxWidth: '580px', borderRadius: '24px' }}>
        <div className="text-center mb-4">
          <div
            className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3 shadow-lg"
            style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)',
              boxShadow: '0 0 24px rgba(79, 70, 229, 0.5)'
            }}
          >
            <FiActivity color="#FFF" size={30} />
          </div>
          <h3 className="brand-title text-white fw-bold mb-1 fs-3">Join Gymkhana Today</h3>
          <p className="auth-subheading mb-0">Create your account to start managing fitness & training</p>
        </div>

        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-12">
            <label className="form-label-custom">Full Name</label>
            <div className="input-icon-wrapper">
              <span className="input-icon-left">
                <FiUser size={18} />
              </span>
              <input
                type="text"
                name="full_name"
                className="form-control glass-input glass-input-with-icon"
                placeholder="John Doe"
                value={formData.full_name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="col-md-6">
            <label className="form-label-custom">Email Address</label>
            <div className="input-icon-wrapper">
              <span className="input-icon-left">
                <FiMail size={18} />
              </span>
              <input
                type="email"
                name="email"
                className="form-control glass-input glass-input-with-icon"
                placeholder="name@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="col-md-6">
            <label className="form-label-custom">Password</label>
            <div className="input-icon-wrapper">
              <span className="input-icon-left">
                <FiLock size={18} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                className="form-control glass-input glass-input-with-both-icons"
                placeholder="Min 6 characters"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="input-icon-right-btn"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          <div className="col-md-6">
            <label className="form-label-custom">Purpose (Account Type)</label>
            <div className="input-icon-wrapper">
              <span className="input-icon-left">
                <FiTarget size={18} />
              </span>
              <select
                name="role"
                className="form-select glass-input ps-5"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="MEMBER" style={{ background: '#0F172A', color: '#FFF' }}>Member</option>
                <option value="TRAINER" style={{ background: '#0F172A', color: '#FFF' }}>Trainer</option>
              </select>
            </div>
          </div>

          <div className="col-md-6">
            <label className="form-label-custom">Phone Number</label>
            <div className="input-icon-wrapper">
              <span className="input-icon-left">
                <FiPhone size={18} />
              </span>
              <input
                type="tel"
                name="phone"
                className="form-control glass-input glass-input-with-icon"
                placeholder="+1-555-0199"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="col-md-6">
            <label className="form-label-custom">Gender</label>
            <select
              name="gender"
              className="form-select glass-input"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="MALE" style={{ background: '#0F172A', color: '#FFF' }}>Male</option>
              <option value="FEMALE" style={{ background: '#0F172A', color: '#FFF' }}>Female</option>
              <option value="OTHER" style={{ background: '#0F172A', color: '#FFF' }}>Other</option>
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label-custom">Date of Birth</label>
            <div className="input-icon-wrapper">
              <span className="input-icon-left">
                <FiCalendar size={18} />
              </span>
              <input
                type="date"
                name="date_of_birth"
                className="form-control glass-input glass-input-with-icon"
                value={formData.date_of_birth}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="col-6 col-md-6">
            <label className="form-label-custom">Height (cm)</label>
            <input
              type="number"
              name="height_cm"
              className="form-control glass-input"
              value={formData.height_cm}
              onChange={handleChange}
            />
          </div>

          <div className="col-6 col-md-6">
            <label className="form-label-custom">Weight (kg)</label>
            <input
              type="number"
              name="weight_kg"
              step="0.1"
              min="20"
              max="300"
              className="form-control glass-input"
              placeholder="70"
              value={formData.weight_kg}
              onChange={handleChange}
            />
          </div>

          <div className="col-12 mt-4">
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary-gradient w-100 py-3 d-flex align-items-center justify-content-center gap-2 fw-semibold"
            >
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  <span>Registering...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <FiArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="text-center mt-4 pt-2">
          <span className="auth-footer-text">Already have an account? </span>
          <Link to="/login" className="auth-link ms-1">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
