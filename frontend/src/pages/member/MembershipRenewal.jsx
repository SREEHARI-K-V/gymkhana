import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { useNotification } from '../../context/NotificationContext';
import api from '../../services/api';
import { SkeletonLoader } from '../../components/SkeletonLoader';
import { Modal } from '../../components/Modal';
import { 
  FiCreditCard, FiClock, FiCheckCircle, FiShield, 
  FiZap, FiStar, FiArrowRight, FiCheck, FiDollarSign, FiFileText
} from 'react-icons/fi';

export const MembershipRenewal = () => {
  const { data, loading, error, refetch } = useFetch('/member/membership');
  const { addToast } = useNotification();
  const navigate = useNavigate();

  const [renewModalOpen, setRenewModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('CARD');
  const [processing, setProcessing] = useState(false);

  if (loading) return <SkeletonLoader count={3} height="150px" />;
  if (error) return <div className="alert alert-danger">{error}</div>;

  const currentSub = data?.current_subscription || {};
  const plans = data?.available_plans || [];

  const handleOpenRenewModal = (plan = null) => {
    setSelectedPlan(plan || plans[1] || plans[0]);
    setRenewModalOpen(true);
  };

  const handleProcessRenewal = async (e) => {
    e.preventDefault();
    if (!selectedPlan) return;
    setProcessing(true);

    try {
      const res = await api.post('/member/renew', {
        plan_id: selectedPlan.id,
        plan_title: selectedPlan.title,
        price: selectedPlan.price,
        duration_months: selectedPlan.duration_months,
        payment_method: paymentMethod === 'CARD' ? 'Visa •••• 4242' : paymentMethod === 'APPLE_PAY' ? 'Apple Pay' : 'UPI Instant'
      });

      if (res.data.success) {
        addToast(res.data.message || 'Membership successfully renewed!', 'success');
        setRenewModalOpen(false);
        refetch();
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Error processing renewal', 'danger');
    } finally {
      setProcessing(false);
    }
  };

  const daysRemaining = currentSub.days_remaining || 0;
  const isExpiringSoon = daysRemaining <= 7 && daysRemaining > 0;
  const isExpired = !currentSub.status || currentSub.status === 'EXPIRED' || daysRemaining <= 0;

  return (
    <div className="d-flex flex-column gap-4">
      {/* Header Banner */}
      <div className="glass-card p-4 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
        <div>
          <span className="badge badge-active mb-2">Member Tier & Billing</span>
          <h3 className="text-white font-weight-bold mb-1">Membership & Renewal</h3>
          <p className="text-muted mb-0">Manage your subscription, review access perks, renew or upgrade to high-performance plans.</p>
        </div>
        <div className="d-flex gap-2 align-self-start align-self-md-center">
          <button 
            onClick={() => navigate('/member/payments')}
            className="btn btn-secondary-glass d-flex align-items-center gap-2"
          >
            <FiFileText size={16} />
            <span>Payment History</span>
          </button>
          <button 
            onClick={() => handleOpenRenewModal()}
            className="btn btn-primary-gradient d-flex align-items-center gap-2"
          >
            <FiZap size={16} />
            <span>Renew Membership</span>
          </button>
        </div>
      </div>

      {/* Active Subscription Status Banner */}
      <div className="glass-card-static p-4 p-md-5 border border-primary border-opacity-30 position-relative overflow-hidden">
        <div className="row align-items-center g-4">
          <div className="col-12 col-lg-8">
            <div className="d-flex align-items-center gap-3 mb-2">
              <span className="badge bg-primary bg-opacity-25 text-cyan border border-primary border-opacity-50">
                CURRENT ACTIVE PLAN
              </span>
              {isExpired ? (
                <span className="badge badge-status badge-expired">EXPIRED</span>
              ) : isExpiringSoon ? (
                <span className="badge badge-status badge-expiring">EXPIRING SOON ({daysRemaining} DAYS)</span>
              ) : (
                <span className="badge badge-status badge-active">ACTIVE & IN GOOD STANDING</span>
              )}
            </div>

            <h2 className="text-white font-weight-bold mb-2">{currentSub.plan_title || 'Pro Performance Plan'}</h2>
            <p className="text-muted mb-3">
              Valid: <strong className="text-white">{currentSub.start_date || '2026-01-01'}</strong> until <strong className="text-cyan">{currentSub.end_date || '2026-12-31'}</strong>
            </p>

            {/* Validity Progress Bar */}
            <div className="mb-4" style={{ maxWidth: '520px' }}>
              <div className="d-flex justify-content-between text-muted small mb-1">
                <span>Plan Expiry Timeline</span>
                <span className="text-cyan fw-bold">{daysRemaining} Days Left</span>
              </div>
              <div className="progress" style={{ height: '8px', background: 'rgba(255, 255, 255, 0.1)' }}>
                <div 
                  className={`progress-bar ${isExpired ? 'bg-danger' : isExpiringSoon ? 'bg-warning' : 'bg-primary-gradient'}`}
                  role="progressbar" 
                  style={{ width: `${Math.min(100, Math.max(5, (daysRemaining / 90) * 100))}%` }}
                />
              </div>
            </div>

            {/* Included Perks Checklist */}
            <div className="row g-2">
              <div className="col-12 col-sm-6">
                <div className="d-flex align-items-center gap-2 text-white small">
                  <FiCheck className="text-success flex-shrink-0" />
                  <span>Unlimited multi-branch gym access</span>
                </div>
              </div>
              <div className="col-12 col-sm-6">
                <div className="d-flex align-items-center gap-2 text-white small">
                  <FiCheck className="text-success flex-shrink-0" />
                  <span>Assigned personal coach & custom routines</span>
                </div>
              </div>
              <div className="col-12 col-sm-6">
                <div className="d-flex align-items-center gap-2 text-white small">
                  <FiCheck className="text-success flex-shrink-0" />
                  <span>Sauna, steam room & recovery facilities</span>
                </div>
              </div>
              <div className="col-12 col-sm-6">
                <div className="d-flex align-items-center gap-2 text-white small">
                  <FiCheck className="text-success flex-shrink-0" />
                  <span>Priority online slot booking system</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-4 text-lg-end">
            <div className="glass-card p-4 rounded-3 d-inline-block text-start w-100" style={{ maxWidth: '300px' }}>
              <small className="text-muted d-block text-uppercase" style={{ fontSize: '0.72rem' }}>Total Plan Value</small>
              <h2 className="text-cyan font-weight-bold mb-2">${currentSub.payment_amount || 129.99}</h2>
              <span className="badge badge-role mb-3">{currentSub.duration_months || 3} Month Period</span>
              <button 
                onClick={() => handleOpenRenewModal()}
                className="btn btn-primary-gradient w-100 d-flex align-items-center justify-content-center gap-2"
              >
                <span>Renew / Extend</span>
                <FiArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Available Plans for Renewal or Upgrade */}
      <div>
        <div className="mb-3">
          <h4 className="text-white font-weight-bold mb-1">Available Renewal & Upgrade Plans</h4>
          <p className="text-muted mb-0 small">Select a plan tier below to renew or upgrade your membership instantaneously.</p>
        </div>

        <div className="row g-3 g-md-4">
          {plans.map((p, idx) => {
            const isCurrent = currentSub.plan_id === p.id || currentSub.plan_title === p.title;
            const isPopular = idx === 1;

            return (
              <div key={p.id} className="col-12 col-md-6 col-xl-3">
                <div 
                  className={`glass-card p-4 rounded-4 h-100 d-flex flex-column justify-content-between position-relative hover-lift transition-all ${
                    isPopular ? 'border-primary shadow-lg' : 'border-secondary border-opacity-25'
                  }`}
                  style={isPopular ? { borderColor: '#6366F1' } : {}}
                >
                  {isPopular && (
                    <span 
                      className="badge bg-primary text-white position-absolute top-0 end-0 m-3 px-2 py-1 fw-bold"
                      style={{ fontSize: '0.7rem' }}
                    >
                      MOST POPULAR
                    </span>
                  )}

                  <div>
                    <span className="badge badge-role mb-2">{p.duration_months} Month{p.duration_months > 1 ? 's' : ''}</span>
                    <h5 className="text-white font-weight-bold mb-1">{p.title}</h5>
                    <div className="d-flex align-items-baseline gap-1 my-3">
                      <h2 className="text-cyan font-weight-bold mb-0">${p.price}</h2>
                      <small className="text-muted">/ term</small>
                    </div>

                    <div className="d-flex flex-column gap-2 border-top border-secondary border-opacity-25 pt-3 my-3">
                      {(p.features || ['Access to Gym Equipment', 'Locker Room Access', 'Fitness Assessment']).map((feat, fIdx) => (
                        <div key={fIdx} className="d-flex align-items-start gap-2 small text-muted">
                          <FiCheck className="text-cyan flex-shrink-0 mt-1" size={14} />
                          <span className="text-white">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-top border-secondary border-opacity-25">
                    <button
                      onClick={() => handleOpenRenewModal(p)}
                      className={`btn w-100 ${isCurrent ? 'btn-secondary-glass' : 'btn-primary-gradient'}`}
                    >
                      {isCurrent ? 'Extend Current Plan' : 'Select & Upgrade'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Renewal / Upgrade Modal */}
      {renewModalOpen && selectedPlan && (
        <Modal 
          isOpen={renewModalOpen} 
          onClose={() => setRenewModalOpen(false)}
          title={`Renew / Upgrade: ${selectedPlan.title}`}
        >
          <form onSubmit={handleProcessRenewal} className="d-flex flex-column gap-4">
            {/* Plan Summary Box */}
            <div className="glass-card-static p-3 rounded-3 d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted small d-block">Selected Subscription</span>
                <h5 className="text-white font-weight-bold mb-0">{selectedPlan.title}</h5>
                <small className="text-cyan">{selectedPlan.duration_months} Months Term</small>
              </div>
              <div className="text-end">
                <span className="text-muted small d-block">Amount Due</span>
                <h3 className="text-cyan font-weight-bold mb-0">${selectedPlan.price}</h3>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="form-label text-muted small fw-semibold">Choose Payment Method</label>
              <div className="row g-2">
                <div className="col-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CARD')}
                    className={`btn w-100 p-3 rounded-3 text-start transition-all ${
                      paymentMethod === 'CARD' ? 'btn-primary-gradient' : 'btn-secondary-glass'
                    }`}
                  >
                    <FiCreditCard className="mb-2 d-block" size={20} />
                    <span className="d-block fw-semibold small">Card</span>
                    <small className="d-block text-truncate" style={{ fontSize: '0.68rem' }}>•••• 4242</small>
                  </button>
                </div>

                <div className="col-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('APPLE_PAY')}
                    className={`btn w-100 p-3 rounded-3 text-start transition-all ${
                      paymentMethod === 'APPLE_PAY' ? 'btn-primary-gradient' : 'btn-secondary-glass'
                    }`}
                  >
                    <FiShield className="mb-2 d-block" size={20} />
                    <span className="d-block fw-semibold small">Apple Pay</span>
                    <small className="d-block" style={{ fontSize: '0.68rem' }}>Instant 1-Click</small>
                  </button>
                </div>

                <div className="col-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('UPI')}
                    className={`btn w-100 p-3 rounded-3 text-start transition-all ${
                      paymentMethod === 'UPI' ? 'btn-primary-gradient' : 'btn-secondary-glass'
                    }`}
                  >
                    <FiZap className="mb-2 d-block" size={20} />
                    <span className="d-block fw-semibold small">UPI / QR</span>
                    <small className="d-block" style={{ fontSize: '0.68rem' }}>Zero Fee</small>
                  </button>
                </div>
              </div>
            </div>

            {paymentMethod === 'CARD' && (
              <div className="d-flex flex-column gap-2 p-3 glass-card rounded-3">
                <div className="row g-2">
                  <div className="col-12">
                    <label className="text-muted small">Card Number</label>
                    <input 
                      type="text" 
                      className="form-control form-control-sm bg-dark text-white border-secondary" 
                      defaultValue="•••• •••• •••• 4242" 
                      readOnly 
                    />
                  </div>
                  <div className="col-6">
                    <label className="text-muted small">Expiry</label>
                    <input 
                      type="text" 
                      className="form-control form-control-sm bg-dark text-white border-secondary" 
                      defaultValue="12/28" 
                      readOnly 
                    />
                  </div>
                  <div className="col-6">
                    <label className="text-muted small">CVC</label>
                    <input 
                      type="password" 
                      className="form-control form-control-sm bg-dark text-white border-secondary" 
                      defaultValue="982" 
                      readOnly 
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="d-flex align-items-center justify-content-between pt-3 border-top border-secondary border-opacity-25">
              <button 
                type="button" 
                onClick={() => setRenewModalOpen(false)}
                className="btn btn-secondary-glass"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={processing}
                className="btn btn-primary-gradient d-flex align-items-center gap-2"
              >
                <FiCheckCircle size={16} />
                <span>{processing ? 'Processing Payment...' : `Confirm & Pay $${selectedPlan.price}`}</span>
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
