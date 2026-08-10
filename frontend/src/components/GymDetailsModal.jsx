import React, { useState } from 'react';
import { 
  FiMapPin, FiClock, FiPhone, FiStar, FiCalendar, 
  FiCheckCircle, FiActivity, FiUser, FiInfo, FiDollarSign, 
  FiLayers, FiGrid, FiNavigation, FiZap, FiX, FiCheck
} from 'react-icons/fi';
import api from '../services/api';
import { useNotification } from '../context/NotificationContext';

export const GymDetailsModal = ({ gym, allGyms = [], onClose, onBookingSuccess, initialTab = 'OVERVIEW' }) => {
  const { addToast } = useNotification();
  const [currentGym, setCurrentGym] = useState(gym || allGyms[0] || null);
  const [activeTab, setActiveTab] = useState(initialTab);
  
  // Plan & Booking Form States
  const [selectedPlan, setSelectedPlan] = useState(
    currentGym?.plans && currentGym.plans.length > 0 ? currentGym.plans[0] : null
  );
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState(currentGym?.available_slots?.[0] || '');
  const [workoutType, setWorkoutType] = useState('Strength & Free Weights');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [digitalPass, setDigitalPass] = useState(null);

  if (!currentGym) return null;

  const handleSelectGym = (gymId) => {
    const found = allGyms.find(g => g.id === Number(gymId));
    if (found) {
      setCurrentGym(found);
      const defaultPlan = found.plans && found.plans.length > 0 ? found.plans[0] : null;
      setSelectedPlan(defaultPlan);
      setSelectedSlot(found.available_slots?.[0] || '');
    }
  };

  const handleSelectPlanAndBook = (plan) => {
    setSelectedPlan(plan);
    setActiveTab('BOOK');
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!currentGym || !selectedSlot) {
      addToast('Please select a valid time slot.', 'danger');
      return;
    }

    setBookingLoading(true);
    try {
      const res = await api.post('/member/bookings', {
        gym_id: currentGym.id,
        booking_date: bookingDate,
        slot_time: selectedSlot,
        workout_type: workoutType,
        plan_title: selectedPlan?.title || 'Day Pass',
        plan_price: selectedPlan?.price || 15
      });

      if (res.data.success) {
        addToast(`Slot successfully booked at ${currentGym.name}!`, 'success');
        setDigitalPass(res.data.booking);
        if (onBookingSuccess) {
          onBookingSuccess(res.data.booking);
        }
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to book slot. Please try again.', 'danger');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div 
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center z-3 p-3 overflow-y-auto" 
      style={{ background: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(10px)' }}
    >
      <div className="glass-card p-4 p-sm-5 w-100 my-auto position-relative" style={{ maxWidth: '820px', borderRadius: '24px' }}>
        
        {/* Digital Pass Overlay View if active */}
        {digitalPass ? (
          <div className="text-center p-2">
            <span className="badge badge-active mb-2">OFFICIAL GYMKHANA ENTRY PASS</span>
            <h3 className="text-white font-weight-bold mb-1">{digitalPass.gym_name}</h3>
            <p className="text-cyan small mb-3">📍 {digitalPass.gym_place || digitalPass.gym_address}</p>

            <div className="glass-card-static p-4 rounded-3 border border-success border-opacity-50 my-3 position-relative overflow-hidden">
              <div className="d-flex align-items-center justify-content-center mb-2">
                <FiGrid size={54} className="text-cyan" />
              </div>
              <span className="badge bg-dark text-cyan font-monospace px-4 py-2 fs-5 tracking-wider d-inline-block mb-3 border border-cyan border-opacity-25">
                {digitalPass.pass_code}
              </span>

              <div className="text-start glass-card p-3 rounded-2 text-muted small d-flex flex-column gap-2">
                <div className="d-flex justify-content-between">
                  <span>Gym Center:</span>
                  <strong className="text-white">{digitalPass.gym_name}</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Place / Location:</span>
                  <strong className="text-cyan">{digitalPass.gym_place}</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Selected Plan:</span>
                  <strong className="text-white">{digitalPass.plan_title} (${digitalPass.plan_price})</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Booking Date:</span>
                  <strong className="text-white">{digitalPass.booking_date}</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Time Slot:</span>
                  <strong className="text-warning">{digitalPass.slot_time}</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Access Area:</span>
                  <strong className="text-white">{digitalPass.workout_type}</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Status:</span>
                  <span className="badge badge-status badge-active">{digitalPass.status}</span>
                </div>
              </div>
            </div>

            <p className="text-muted small mb-4">
              Present this pass code at the center scanner upon arrival for automated entry.
            </p>

            <div className="d-flex gap-2">
              <button 
                onClick={() => setDigitalPass(null)} 
                className="btn btn-secondary-glass flex-fill"
              >
                Book Another Slot
              </button>
              <button 
                onClick={onClose} 
                className="btn btn-primary-gradient flex-fill"
              >
                Done / Close Pass
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Modal Header */}
            <div className="d-flex align-items-start justify-content-between mb-3 border-bottom border-secondary border-opacity-25 pb-3">
              <div>
                <div className="d-flex align-items-center flex-wrap gap-2 mb-1">
                  <span className="badge badge-active">📍 {currentGym.city}</span>
                  <span className="badge bg-warning bg-opacity-25 text-warning d-flex align-items-center gap-1">
                    <FiStar size={12} fill="#EAB308" /> {currentGym.rating} ({currentGym.reviews_count || 150} reviews)
                  </span>
                  <span className="badge bg-dark text-cyan">
                    <FiZap size={11} className="text-warning me-1" />
                    {currentGym.capacity_status || 'Open Today'}
                  </span>
                </div>

                <h4 className="text-white font-weight-bold mb-1">{currentGym.name}</h4>
                <p className="text-cyan small mb-0 fw-semibold">
                  <FiNavigation className="me-1" size={13} />
                  Place: {currentGym.place || currentGym.address}
                </p>
              </div>

              <div className="d-flex align-items-center gap-2">
                {/* Gym Selector Dropdown if multiple gyms */}
                {allGyms.length > 1 && (
                  <select 
                    className="form-select form-select-sm glass-input text-white"
                    value={currentGym.id}
                    onChange={(e) => handleSelectGym(e.target.value)}
                    style={{ maxWidth: '180px', fontSize: '0.8rem' }}
                  >
                    {allGyms.map(g => (
                      <option key={g.id} value={g.id} style={{ background: '#0F172A', color: '#FFF' }}>
                        📍 {g.name}
                      </option>
                    ))}
                  </select>
                )}

                <button 
                  onClick={onClose} 
                  className="btn-close btn-close-white ms-2" 
                  aria-label="Close"
                />
              </div>
            </div>

            {/* Modal Tabs Navigation */}
            <div className="d-flex align-items-center gap-2 mb-4 border-bottom border-secondary border-opacity-25 pb-2 overflow-x-auto">
              <button
                onClick={() => setActiveTab('OVERVIEW')}
                className={`btn btn-sm text-nowrap rounded-pill ${
                  activeTab === 'OVERVIEW' ? 'btn-cyan-gradient font-weight-bold' : 'btn-secondary-glass text-muted'
                }`}
              >
                <FiInfo className="me-1" /> Overview & Place
              </button>
              <button
                onClick={() => setActiveTab('PLANS')}
                className={`btn btn-sm text-nowrap rounded-pill ${
                  activeTab === 'PLANS' ? 'btn-cyan-gradient font-weight-bold' : 'btn-secondary-glass text-muted'
                }`}
              >
                <FiDollarSign className="me-1" /> Plans & Pricing ({currentGym.plans?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('TRAINERS')}
                className={`btn btn-sm text-nowrap rounded-pill ${
                  activeTab === 'TRAINERS' ? 'btn-cyan-gradient font-weight-bold' : 'btn-secondary-glass text-muted'
                }`}
              >
                <FiUser className="me-1" /> Coaches & Amenities
              </button>
              <button
                onClick={() => setActiveTab('BOOK')}
                className={`btn btn-sm text-nowrap rounded-pill ${
                  activeTab === 'BOOK' ? 'btn-primary-gradient font-weight-bold' : 'btn-secondary-glass text-muted'
                }`}
              >
                <FiCalendar className="me-1" /> Book Slot Now
              </button>
            </div>

            {/* TAB 1: OVERVIEW & PLACE DETAILS */}
            {activeTab === 'OVERVIEW' && (
              <div className="d-flex flex-column gap-3">
                <div className="glass-card-static p-3 rounded-3">
                  <h6 className="text-white font-weight-bold mb-2">About {currentGym.name}</h6>
                  <p className="text-muted small mb-0">
                    {currentGym.description || 'Modern, clean, and fully equipped Gymkhana fitness facility offering premium strength training gear, functional turf areas, and luxury wellness facilities.'}
                  </p>
                </div>

                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <div className="glass-card p-3 rounded-3 h-100">
                      <h6 className="text-cyan font-weight-bold mb-2 d-flex align-items-center gap-1">
                        <FiMapPin size={15} /> Location & Place Details
                      </h6>
                      <ul className="list-unstyled text-muted small mb-0 d-flex flex-column gap-2">
                        <li><strong className="text-white">Gym Name:</strong> {currentGym.name}</li>
                        <li><strong className="text-white">Place / Area:</strong> {currentGym.place || currentGym.city}</li>
                        <li><strong className="text-white">Street Address:</strong> {currentGym.address}</li>
                        {currentGym.landmark && (
                          <li><strong className="text-white">Landmark:</strong> {currentGym.landmark}</li>
                        )}
                        <li><strong className="text-white">City Zone:</strong> {currentGym.city}</li>
                      </ul>
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="glass-card p-3 rounded-3 h-100">
                      <h6 className="text-cyan font-weight-bold mb-2 d-flex align-items-center gap-1">
                        <FiClock size={15} /> Operating & Contact Details
                      </h6>
                      <ul className="list-unstyled text-muted small mb-0 d-flex flex-column gap-2">
                        <li><strong className="text-white">Hours:</strong> {currentGym.operating_hours}</li>
                        <li><strong className="text-white">Phone:</strong> {currentGym.phone}</li>
                        {currentGym.email && (
                          <li><strong className="text-white">Email:</strong> {currentGym.email}</li>
                        )}
                        {currentGym.manager && (
                          <li><strong className="text-white">Manager:</strong> {currentGym.manager}</li>
                        )}
                        <li>
                          <strong className="text-white">Status:</strong>{' '}
                          <span className="badge badge-active">{currentGym.capacity_status || 'Open Today'}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Available Slots Preview */}
                {currentGym.available_slots && (
                  <div className="glass-card-static p-3 rounded-3">
                    <h6 className="text-white font-weight-bold mb-2 d-flex align-items-center gap-2">
                      <FiClock className="text-warning" size={15} /> Available Workout Time Slots
                    </h6>
                    <div className="d-flex flex-wrap gap-2">
                      {currentGym.available_slots.map((slot, idx) => (
                        <span key={idx} className="badge badge-role py-2 px-3" style={{ fontSize: '0.8rem' }}>
                          🕒 {slot}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="d-flex align-items-center justify-content-end gap-2 mt-3 pt-3 border-top border-secondary border-opacity-25">
                  <button 
                    onClick={() => setActiveTab('PLANS')} 
                    className="btn btn-secondary-glass d-flex align-items-center gap-2"
                  >
                    <span>View Membership Plans</span> →
                  </button>
                  <button 
                    onClick={() => setActiveTab('BOOK')} 
                    className="btn btn-primary-gradient d-flex align-items-center gap-2"
                  >
                    <FiCalendar size={16} />
                    <span>Proceed to Book Slot</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: PLANS & PRICING */}
            {activeTab === 'PLANS' && (
              <div className="d-flex flex-column gap-3">
                <p className="text-muted small mb-1">
                  Select a pass or plan for <strong>{currentGym.name}</strong> to proceed with slot booking:
                </p>
                <div className="row g-3">
                  {currentGym.plans?.map((plan) => (
                    <div key={plan.id} className="col-12 col-md-6">
                      <div 
                        className={`glass-card p-3 rounded-3 h-100 d-flex flex-column justify-content-between border ${
                          selectedPlan?.id === plan.id 
                            ? 'border-primary border-2 bg-primary bg-opacity-10' 
                            : 'border-secondary border-opacity-25'
                        }`}
                      >
                        <div>
                          <div className="d-flex align-items-center justify-content-between mb-2">
                            <h6 className="text-white font-weight-bold mb-0">{plan.title}</h6>
                            {selectedPlan?.id === plan.id && (
                              <span className="badge badge-active">SELECTED</span>
                            )}
                          </div>
                          <div className="d-flex align-items-baseline gap-1 mb-2">
                            <span className="fs-3 font-weight-bold text-cyan">${plan.price}</span>
                            <span className="text-muted small">/ {plan.period}</span>
                          </div>
                          <ul className="list-unstyled mb-3">
                            {plan.benefits?.map((b, bIdx) => (
                              <li key={bIdx} className="text-muted small d-flex align-items-center gap-2 mb-1">
                                <FiCheckCircle className="text-success" size={13} />
                                <span>{b}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <button
                          onClick={() => handleSelectPlanAndBook(plan)}
                          className={`btn btn-sm w-100 ${
                            selectedPlan?.id === plan.id 
                              ? 'btn-primary-gradient' 
                              : 'btn-secondary-glass'
                          }`}
                        >
                          {selectedPlan?.id === plan.id ? 'Book Slot with This Plan' : 'Select Plan & Book'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: COACHES & AMENITIES */}
            {activeTab === 'TRAINERS' && (
              <div className="d-flex flex-column gap-3">
                {/* Certified Coaches */}
                {currentGym.trainers && currentGym.trainers.length > 0 && (
                  <div>
                    <h6 className="text-white font-weight-bold mb-2 d-flex align-items-center gap-2">
                      <FiUser className="text-cyan" /> Featured Coaches & Trainers
                    </h6>
                    <div className="row g-2">
                      {currentGym.trainers.map((t, idx) => (
                        <div key={idx} className="col-12 col-md-6">
                          <div className="glass-card-static p-3 rounded-3 d-flex align-items-center gap-3">
                            <div className="bg-primary bg-opacity-25 rounded-circle p-2 text-cyan d-flex align-items-center justify-content-center" style={{ width: '42px', height: '42px' }}>
                              <FiUser size={20} />
                            </div>
                            <div>
                              <h6 className="text-white font-weight-bold mb-0">{t.name}</h6>
                              <small className="text-cyan d-block">{t.role}</small>
                              <small className="text-muted">Experience: {t.exp}</small>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* All Facilities */}
                <div>
                  <h6 className="text-white font-weight-bold mb-2 d-flex align-items-center gap-2">
                    <FiLayers className="text-cyan" /> Full Amenities & Facilities List
                  </h6>
                  <div className="row g-2">
                    {currentGym.facilities?.map((fac, idx) => (
                      <div key={idx} className="col-6 col-md-4">
                        <div className="glass-card p-2 rounded-2 d-flex align-items-center gap-2 text-muted small">
                          <FiCheckCircle className="text-success" size={14} />
                          <span className="text-white">{fac}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="d-flex align-items-center justify-content-end mt-3 pt-3 border-top border-secondary border-opacity-25">
                  <button 
                    onClick={() => setActiveTab('BOOK')} 
                    className="btn btn-primary-gradient d-flex align-items-center gap-2"
                  >
                    <FiCalendar size={16} />
                    <span>Proceed to Book Slot</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 4: BOOK SLOT NOW FORM */}
            {activeTab === 'BOOK' && (
              <form onSubmit={handleConfirmBooking} className="d-flex flex-column gap-3">
                {/* Selected Plan Summary Banner */}
                <div className="glass-card p-3 rounded-3 border border-cyan border-opacity-25 d-flex align-items-center justify-content-between">
                  <div>
                    <span className="text-muted small d-block">Selected Gym Plan:</span>
                    <h6 className="text-white font-weight-bold mb-0">
                      {selectedPlan ? selectedPlan.title : 'Day Pass'}{' '}
                      <span className="text-cyan">(${selectedPlan ? selectedPlan.price : 15})</span>
                    </h6>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setActiveTab('PLANS')} 
                    className="btn btn-link text-cyan p-0 small fw-bold text-decoration-none"
                  >
                    Change Plan
                  </button>
                </div>

                {/* Date Selection */}
                <div>
                  <label className="form-label-custom">Select Booking Date</label>
                  <input
                    type="date"
                    className="form-control glass-input"
                    min={new Date().toISOString().split('T')[0]}
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    required
                  />
                </div>

                {/* Time Slot Selection */}
                <div>
                  <label className="form-label-custom">Available Training Time Slot</label>
                  <select
                    className="form-select glass-input"
                    value={selectedSlot}
                    onChange={(e) => setSelectedSlot(e.target.value)}
                    required
                  >
                    {currentGym.available_slots?.map((slot, i) => (
                      <option key={i} value={slot} style={{ background: '#0F172A', color: '#FFF' }}>
                        🕒 {slot}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Workout Zone Access */}
                <div>
                  <label className="form-label-custom">Workout / Facility Access Zone</label>
                  <select
                    className="form-select glass-input"
                    value={workoutType}
                    onChange={(e) => setWorkoutType(e.target.value)}
                  >
                    <option value="Strength & Free Weights" style={{ background: '#0F172A', color: '#FFF' }}>Strength & Free Weights Floor</option>
                    <option value="Cardio & Functional Floor" style={{ background: '#0F172A', color: '#FFF' }}>Cardio & Functional Floor</option>
                    <option value="HIIT & Boxing Studio" style={{ background: '#0F172A', color: '#FFF' }}>HIIT & Boxing Studio</option>
                    <option value="Sauna & Recovery Spa" style={{ background: '#0F172A', color: '#FFF' }}>Sauna & Recovery Spa</option>
                    <option value="Personal Trainer Session" style={{ background: '#0F172A', color: '#FFF' }}>Personal Trainer Session</option>
                  </select>
                </div>

                {/* Booking Summary Box */}
                <div className="glass-card-static p-3 rounded-3">
                  <small className="text-cyan fw-bold d-block mb-1">Booking Pass Summary:</small>
                  <div className="d-flex flex-column gap-1 text-muted small">
                    <div><strong>Gym Center:</strong> {currentGym.name}</div>
                    <div><strong>Place / Location:</strong> {currentGym.place || currentGym.address}</div>
                    <div><strong>Scheduled Date & Slot:</strong> {bookingDate} @ {selectedSlot}</div>
                    <div><strong>Access Area:</strong> {workoutType}</div>
                  </div>
                </div>

                {/* Form Action Buttons */}
                <div className="d-flex align-items-center justify-content-end gap-2 mt-3 pt-2 border-top border-secondary border-opacity-25">
                  <button
                    type="button"
                    onClick={onClose}
                    className="btn btn-secondary-glass"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="btn btn-primary-gradient d-flex align-items-center gap-2"
                  >
                    {bookingLoading ? (
                      <span>Reserving Slot...</span>
                    ) : (
                      <>
                        <FiCheckCircle size={16} />
                        <span>Confirm Gym Slot Pass</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};
