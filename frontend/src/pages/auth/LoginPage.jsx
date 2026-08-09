import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../context/NotificationContext';
import { FiActivity, FiLock, FiMail, FiArrowRight } from 'react-icons/fi';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

  const fillQuickAccount = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center p-4">
      <div className="glass-card p-4 p-sm-5 w-100" style={{ maxWidth: '480px' }}>
        <div className="text-center mb-4">
          <div
            className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
            style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg, #4F46E5, #06B6D4)', boxShadow: '0 0 24px rgba(79, 70, 229, 0.5)' }}
          >
            <FiActivity color="#FFF" size={32} />
          </div>
          <h2 className="text-white font-weight-bold tracking-tight">GYMKHANA</h2>
          <p className="text-muted" style={{ fontSize: '0.9rem' }}>Gym Subscription & Workout Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
          <div>
            <label className="form-label text-muted small fw-semibold">Email Address</label>
            <div className="position-relative">
              <FiMail className="position-absolute top-50 translate-middle-y ms-3 text-muted" size={18} />
              <input
                type="email"
                className="form-control glass-input ps-5"
                placeholder="name@gymkhana.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="form-label text-muted small fw-semibold">Password</label>
            <div className="position-relative">
              <FiLock className="position-absolute top-50 translate-middle-y ms-3 text-muted" size={18} />
              <input
                type="password"
                className="form-control glass-input ps-5"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary-gradient w-100 mt-2 d-flex align-items-center justify-content-center gap-2"
          >
            {submitting ? (
              <span>Signing in...</span>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <FiArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Demo Quick Login Shortcuts */}
        <div className="mt-4 pt-3 border-top border-secondary border-opacity-25 text-center">
          <small className="text-muted d-block mb-2">⚡ Quick Demo One-Click Sign In:</small>
          <div className="d-flex justify-content-center gap-2 flex-wrap">
            <button
              onClick={() => fillQuickAccount('admin@gymkhana.com', 'admin123')}
              className="btn btn-secondary-glass btn-sm"
              type="button"
            >
              Admin Demo
            </button>
            <button
              onClick={() => fillQuickAccount('alex.trainer@gymkhana.com', 'trainer123')}
              className="btn btn-secondary-glass btn-sm"
              type="button"
            >
              Trainer Demo
            </button>
            <button
              onClick={() => fillQuickAccount('john@gmail.com', 'member123')}
              className="btn btn-secondary-glass btn-sm"
              type="button"
            >
              Member Demo
            </button>
          </div>
        </div>

        <div className="text-center mt-4">
          <span className="text-muted small">Don't have an account? </span>
          <Link to="/register" className="text-cyan fw-bold text-decoration-none">
            Create Member Account
          </Link>
        </div>
      </div>
    </div>
  );
};
