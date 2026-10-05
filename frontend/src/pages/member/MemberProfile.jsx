import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useFetch } from '../../hooks/useFetch';
import { useNotification } from '../../context/NotificationContext';
import api from '../../services/api';
import { SkeletonLoader } from '../../components/SkeletonLoader';
import { Modal } from '../../components/Modal';
import { 
  FiUser, FiMail, FiPhone, FiCalendar, FiTarget, 
  FiAward, FiEdit3, FiCheckCircle, FiShield, FiHeart, 
  FiActivity, FiChevronRight, FiClock, FiMapPin
} from 'react-icons/fi';

export const MemberProfile = () => {
  const { user } = useAuth();
  const { data, loading, error, refetch } = useFetch('/member/profile');
  const { addToast } = useNotification();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    gender: 'MALE',
    date_of_birth: '',
    height_cm: 175,
    target_weight: 72,
    fitness_goal: 'Muscle Building & Hypertrophy',
    experience_level: 'Intermediate',
    emergency_contact: '',
    blood_group: 'O+',
    dietary_preference: 'High Protein / Omnivore'
  });

  const profile = data?.profile || {};

  useEffect(() => {
    if (data?.profile) {
      setFormData({
        full_name: profile.full_name || user?.full_name || '',
        phone: profile.phone || user?.phone || '',
        gender: profile.gender || 'MALE',
        date_of_birth: profile.date_of_birth || '1995-01-01',
        height_cm: profile.height_cm || 175,
        target_weight: profile.target_weight || 72,
        fitness_goal: profile.fitness_goal || 'Muscle Building & Hypertrophy',
        experience_level: profile.experience_level || 'Intermediate',
        emergency_contact: profile.emergency_contact || '',
        blood_group: profile.blood_group || 'O+',
        dietary_preference: profile.dietary_preference || 'High Protein / Omnivore'
      });
    }
  }, [data, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/member/profile', formData);
      if (res.data.success) {
        addToast('Profile updated successfully!', 'success');
        setEditModalOpen(false);
        refetch();
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Error updating profile', 'danger');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <SkeletonLoader count={3} height="150px" />;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="d-flex flex-column gap-4">
      {/* Header Banner */}
      <div className="glass-card p-4 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 position-relative overflow-hidden">
        <div className="d-flex align-items-center gap-3">
          <div 
            className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-lg flex-shrink-0"
            style={{ 
              width: '72px', 
              height: '72px', 
              fontSize: '1.75rem',
              background: 'linear-gradient(135deg, #6366F1, #06B6D4)' 
            }}
          >
            {(profile.full_name || user?.full_name || 'M')[0].toUpperCase()}
          </div>
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <h3 className="text-white font-weight-bold mb-0">{profile.full_name || user?.full_name}</h3>
              <span className="badge badge-active">{profile.subscription_status || 'ACTIVE'}</span>
            </div>
            <p className="text-muted mb-0 small">
              Member ID: <span className="text-cyan font-monospace fw-bold">{profile.member_code || 'GK-MEM-1049'}</span> • Member since {profile.join_date || '2026'}
            </p>
          </div>
        </div>

        <button 
          onClick={() => setEditModalOpen(true)}
          className="btn btn-primary-gradient d-flex align-items-center gap-2 align-self-start align-self-md-center"
        >
          <FiEdit3 size={16} />
          <span>Edit Profile</span>
        </button>
      </div>

      <div className="row g-4">
        {/* Left Column: Digital Member ID Card & Trainer Info */}
        <div className="col-12 col-lg-5">
          <div className="d-flex flex-column gap-4">
            {/* Holographic Digital Member Pass */}
            <div 
              className="p-4 rounded-4 position-relative overflow-hidden text-white shadow-lg border border-primary border-opacity-50"
              style={{ 
                background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.9) 0%, rgba(15, 23, 42, 0.95) 50%, rgba(14, 116, 144, 0.8) 100%)',
                backdropFilter: 'blur(16px)'
              }}
            >
              <div className="d-flex align-items-center justify-content-between mb-4">
                <div className="d-flex align-items-center gap-2">
                  <div className="brand-logo-emblem">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2L20.5 6.8V17.2L12 22L3.5 17.2V6.8L12 2Z" stroke="#38BDF8" strokeWidth="2" />
                      <circle cx="12" cy="12" r="2" fill="#818CF8" />
                    </svg>
                  </div>
                  <span className="fw-bold tracking-wider" style={{ letterSpacing: '0.1em' }}>GYMKHANA PASS</span>
                </div>
                <span className="badge bg-warning text-dark fw-bold">VIP ACCESS</span>
              </div>

              <div className="my-3">
                <small className="text-muted text-uppercase d-block" style={{ fontSize: '0.7rem' }}>Member Name</small>
                <h4 className="fw-bold text-white mb-0">{profile.full_name || user?.full_name}</h4>
              </div>

              <div className="row g-2 my-2 pt-2 border-top border-secondary border-opacity-25">
                <div className="col-6">
                  <small className="text-muted d-block" style={{ fontSize: '0.68rem' }}>CURRENT PLAN</small>
                  <span className="fw-semibold text-cyan small">{profile.plan_title || 'Pro Performance Plan'}</span>
                </div>
                <div className="col-6">
                  <small className="text-muted d-block" style={{ fontSize: '0.68rem' }}>MEMBER ID</small>
                  <span className="fw-semibold font-monospace small">{profile.member_code || 'GK-MEM-1049'}</span>
                </div>
              </div>

              <div className="d-flex align-items-center justify-content-between pt-3 mt-3 border-top border-secondary border-opacity-25">
                <div className="d-flex align-items-center gap-2">
                  <div className="p-2 bg-dark rounded-2 border border-secondary border-opacity-50">
                    <span className="font-monospace text-cyan" style={{ fontSize: '0.75rem' }}>[QR VERIFIED]</span>
                  </div>
                  <small className="text-muted" style={{ fontSize: '0.7rem' }}>Scan at any Gymkhana branch turnstile</small>
                </div>
                <FiShield className="text-cyan" size={24} />
              </div>
            </div>

            {/* Assigned Trainer Card */}
            <div className="glass-card-static p-4">
              <h5 className="text-white font-weight-bold mb-3 d-flex align-items-center gap-2">
                <FiUser className="text-primary" /> Assigned Personal Coach
              </h5>
              <div className="d-flex align-items-center gap-3 p-3 glass-card rounded-3">
                <div 
                  className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0"
                  style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #10B981, #06B6D4)' }}
                >
                  {(profile.trainer_name || 'A')[0]}
                </div>
                <div className="flex-grow-1">
                  <h6 className="text-white font-weight-bold mb-0">{profile.trainer_name || 'Alex Vance'}</h6>
                  <small className="text-cyan d-block">Senior Strength & Conditioning Coach</small>
                  <small className="text-muted">Specialist in Hypertrophy & Olympic Lifting</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Personal Details & Biometrics */}
        <div className="col-12 col-lg-7">
          <div className="glass-card-static p-4 h-100 d-flex flex-column justify-content-between">
            <div>
              <h5 className="text-white font-weight-bold mb-4 d-flex align-items-center gap-2">
                <FiActivity className="text-cyan" /> Personal Details & Biometrics
              </h5>

              <div className="row g-3">
                <div className="col-12 col-sm-6">
                  <div className="p-3 glass-card rounded-3">
                    <small className="text-muted d-block mb-1">
                      <FiMail className="me-1" /> Email Address
                    </small>
                    <span className="text-white fw-semibold">{profile.email || user?.email}</span>
                  </div>
                </div>

                <div className="col-12 col-sm-6">
                  <div className="p-3 glass-card rounded-3">
                    <small className="text-muted d-block mb-1">
                      <FiPhone className="me-1" /> Phone Number
                    </small>
                    <span className="text-white fw-semibold">{profile.phone || '+1 (555) 010-4492'}</span>
                  </div>
                </div>

                <div className="col-12 col-sm-6">
                  <div className="p-3 glass-card rounded-3">
                    <small className="text-muted d-block mb-1">
                      <FiCalendar className="me-1" /> Date of Birth
                    </small>
                    <span className="text-white fw-semibold">{profile.date_of_birth || '1995-05-19'}</span>
                  </div>
                </div>

                <div className="col-12 col-sm-6">
                  <div className="p-3 glass-card rounded-3">
                    <small className="text-muted d-block mb-1">
                      <FiUser className="me-1" /> Gender
                    </small>
                    <span className="text-white fw-semibold">{profile.gender || 'MALE'}</span>
                  </div>
                </div>

                <div className="col-12 col-sm-6">
                  <div className="p-3 glass-card rounded-3">
                    <small className="text-muted d-block mb-1">
                      <FiActivity className="me-1" /> Height & Weight
                    </small>
                    <span className="text-white fw-semibold">
                      {profile.height_cm || 175} cm • {profile.current_weight || 75} kg
                    </span>
                  </div>
                </div>

                <div className="col-12 col-sm-6">
                  <div className="p-3 glass-card rounded-3">
                    <small className="text-muted d-block mb-1">
                      <FiTarget className="me-1" /> Target Weight
                    </small>
                    <span className="text-cyan fw-bold">
                      {profile.target_weight || 72} kg
                    </span>
                  </div>
                </div>

                <div className="col-12 col-sm-6">
                  <div className="p-3 glass-card rounded-3">
                    <small className="text-muted d-block mb-1">
                      <FiAward className="me-1" /> Primary Goal
                    </small>
                    <span className="text-white fw-semibold">{profile.fitness_goal || 'Muscle Building & Hypertrophy'}</span>
                  </div>
                </div>

                <div className="col-12 col-sm-6">
                  <div className="p-3 glass-card rounded-3">
                    <small className="text-muted d-block mb-1">
                      <FiHeart className="me-1" /> Emergency Contact
                    </small>
                    <span className="text-white fw-semibold">{profile.emergency_contact || '+1 (555) 992-1200 (Family)'}</span>
                  </div>
                </div>

                <div className="col-12 col-sm-6">
                  <div className="p-3 glass-card rounded-3">
                    <small className="text-muted d-block mb-1">Experience Level</small>
                    <span className="badge badge-role">{profile.experience_level || 'Intermediate'}</span>
                  </div>
                </div>

                <div className="col-12 col-sm-6">
                  <div className="p-3 glass-card rounded-3">
                    <small className="text-muted d-block mb-1">Dietary Preference</small>
                    <span className="badge badge-active">{profile.dietary_preference || 'High Protein'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-top border-secondary border-opacity-25 d-flex align-items-center justify-content-between">
              <span className="text-muted small">Need to update your emergency contact or biometrics?</span>
              <button 
                onClick={() => setEditModalOpen(true)}
                className="btn btn-secondary-glass btn-sm"
              >
                Update Info
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editModalOpen && (
        <Modal 
          isOpen={editModalOpen} 
          onClose={() => setEditModalOpen(false)} 
          title="Edit Member Profile & Biometrics"
        >
          <form onSubmit={handleSaveProfile} className="d-flex flex-column gap-3">
            <div className="row g-3">
              <div className="col-12 col-sm-6">
                <label className="form-label text-muted small">Full Name</label>
                <input 
                  type="text" 
                  name="full_name" 
                  className="form-control bg-dark text-white border-secondary"
                  value={formData.full_name} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>

              <div className="col-12 col-sm-6">
                <label className="form-label text-muted small">Phone Number</label>
                <input 
                  type="text" 
                  name="phone" 
                  className="form-control bg-dark text-white border-secondary"
                  value={formData.phone} 
                  onChange={handleInputChange} 
                />
              </div>

              <div className="col-12 col-sm-6">
                <label className="form-label text-muted small">Date of Birth</label>
                <input 
                  type="date" 
                  name="date_of_birth" 
                  className="form-control bg-dark text-white border-secondary"
                  value={formData.date_of_birth} 
                  onChange={handleInputChange} 
                />
              </div>

              <div className="col-12 col-sm-6">
                <label className="form-label text-muted small">Gender</label>
                <select 
                  name="gender" 
                  className="form-select bg-dark text-white border-secondary"
                  value={formData.gender} 
                  onChange={handleInputChange}
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div className="col-12 col-sm-6">
                <label className="form-label text-muted small">Height (cm)</label>
                <input 
                  type="number" 
                  name="height_cm" 
                  step="0.1"
                  className="form-control bg-dark text-white border-secondary"
                  value={formData.height_cm} 
                  onChange={handleInputChange} 
                />
              </div>

              <div className="col-12 col-sm-6">
                <label className="form-label text-muted small">Target Weight (kg)</label>
                <input 
                  type="number" 
                  name="target_weight" 
                  step="0.5"
                  className="form-control bg-dark text-white border-secondary"
                  value={formData.target_weight} 
                  onChange={handleInputChange} 
                />
              </div>

              <div className="col-12 col-sm-6">
                <label className="form-label text-muted small">Primary Fitness Goal</label>
                <select 
                  name="fitness_goal" 
                  className="form-select bg-dark text-white border-secondary"
                  value={formData.fitness_goal} 
                  onChange={handleInputChange}
                >
                  <option value="Muscle Building & Hypertrophy">Muscle Building & Hypertrophy</option>
                  <option value="Fat Loss & Shred">Fat Loss & Shred</option>
                  <option value="Powerlifting & Strength">Powerlifting & Strength</option>
                  <option value="Athletic Conditioning">Athletic Conditioning</option>
                  <option value="General Fitness & Longevity">General Fitness & Longevity</option>
                </select>
              </div>

              <div className="col-12 col-sm-6">
                <label className="form-label text-muted small">Experience Level</label>
                <select 
                  name="experience_level" 
                  className="form-select bg-dark text-white border-secondary"
                  value={formData.experience_level} 
                  onChange={handleInputChange}
                >
                  <option value="Beginner">Beginner (&lt; 1 year)</option>
                  <option value="Intermediate">Intermediate (1-3 years)</option>
                  <option value="Advanced">Advanced (3+ years)</option>
                  <option value="Elite Athlete">Elite Athlete</option>
                </select>
              </div>

              <div className="col-12">
                <label className="form-label text-muted small">Emergency Contact (Name & Number)</label>
                <input 
                  type="text" 
                  name="emergency_contact" 
                  className="form-control bg-dark text-white border-secondary"
                  value={formData.emergency_contact} 
                  onChange={handleInputChange} 
                  placeholder="e.g. Sarah Thomas +1 (555) 992-1200"
                />
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top border-secondary border-opacity-25">
              <button 
                type="button" 
                onClick={() => setEditModalOpen(false)} 
                className="btn btn-secondary-glass"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={saving} 
                className="btn btn-primary-gradient"
              >
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
