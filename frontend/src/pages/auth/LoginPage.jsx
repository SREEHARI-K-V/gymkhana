import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../context/NotificationContext';
import { FiActivity, FiLock, FiMail, FiArrowRight, FiEye, FiEyeOff } from 'react-icons/fi';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const { addToast } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await login(email, password);
      addToast(`Welcome back, ${res.user.full_name}!`, 'success');
      
      if (res.role === 'ADMIN') navigate('/admin');
      else if (res.role === 'TRAINER') navigate('/trainer');
      else navigate('/member');
    } catch (err) {
      addToast(err.response?.data?.message || 'Login failed. Please check your credentials.', 'danger');
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
          width: '450px',
          height: '450px',
          background: 'radial-gradient(circle, rgba(79, 70, 229, 0.25) 0%, rgba(0, 0, 0, 0) 70%)',
          top: '-10%',
          left: '-10%',
          filter: 'blur(50px)',
          pointerEvents: 'none'
        }}
      />
      <div
        className="position-absolute rounded-circle"
        style={{
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.2) 0%, rgba(0, 0, 0, 0) 70%)',
          bottom: '-10%',
          right: '-10%',
          filter: 'blur(50px)',
          pointerEvents: 'none'
        }}
      />

      <div className="glass-card p-4 p-sm-5 w-100 position-relative z-1" style={{ maxWidth: '460px', borderRadius: '24px' }}>
        {/* Header Section */}
        <div className="text-center mb-4">
          <div
            className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3 shadow-lg"
            style={{
              width: '64px',
              height: '64px',
              background: 'linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)',
              boxShadow: '0 0 30px rgba(79, 70, 229, 0.5)'
            }}
          >
            <FiActivity color="#FFFFFF" size={32} />
          </div>
          <h2 className="brand-title text-white fw-bold mb-1 tracking-tight fs-3">GYMKHANA</h2>
          <p className="auth-subheading mb-0">Gym Subscription & Workout Management System</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
          <div>
            <label htmlFor="login-email" className="form-label-custom">
              Email Address
            </label>
            <div className="input-icon-wrapper">
              <span className="input-icon-left">
                <FiMail size={18} />
              </span>
              <input
                id="login-email"
                type="email"
                className="form-control glass-input glass-input-with-icon"
                placeholder="name@gymkhana.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <div className="d-flex align-items-center justify-content-between mb-1">
              <label htmlFor="login-password" className="form-label-custom mb-0">
                Password
              </label>
            </div>
            <div className="input-icon-wrapper">
              <span className="input-icon-left">
                <FiLock size={18} />
              </span>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                className="form-control glass-input glass-input-with-both-icons"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="input-icon-right-btn"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide password' : 'Show password'}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary-gradient w-100 py-3 mt-2 d-flex align-items-center justify-content-center gap-2 fw-semibold"
            style={{ fontSize: '0.95rem' }}
          >
            {submitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <FiArrowRight size={18} />
              </>
            )}
          </button>
        </form>



        {/* Register CTA Footer */}
        <div className="text-center mt-4">
          <span className="auth-footer-text">Don't have an account? </span>
          <Link to="/register" className="auth-link ms-1">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};
