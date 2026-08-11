import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { SkeletonLoader } from '../../components/SkeletonLoader';
import { StatCard } from '../../components/StatCard';
import { ProgressAnalyticsChart } from '../../components/ProgressAnalyticsChart';
import { GymDetailsModal } from '../../components/GymDetailsModal';
import { 
  FiCalendar, FiClock, FiActivity, FiPieChart, FiCheckSquare, 
  FiArrowRight, FiMapPin, FiNavigation, FiDollarSign, FiStar, FiCheckCircle, FiGrid, FiPhone, FiLayers
} from 'react-icons/fi';

export const MemberDashboard = () => {
  const { data, loading, error, refetch } = useFetch('/member/dashboard');
  const navigate = useNavigate();

  // State for Gym Details Modal & Digital Pass Ticket Modal
  const [activeGymModal, setActiveGymModal] = useState(null);
  const [modalTab, setModalTab] = useState('OVERVIEW');
  const [viewPassBooking, setViewPassBooking] = useState(null);

  if (loading) return <SkeletonLoader count={3} height="140px" />;
  if (error) return <div className="alert alert-danger">{error}</div>;

  const member = data?.member || {};
  const subscription = data?.subscription || {};
  const todayDay = data?.today_day || 'MONDAY';
  const todaysExercises = data?.todays_exercises || [];
  const todaysMeals = data?.todays_meals || [];
  const progressSummary = data?.progress_summary || {};
  const activeBookings = data?.active_bookings || [];
  const gyms = data?.gyms || [];

  const handleOpenGymModal = (gym = null, tab = 'OVERVIEW') => {
    setActiveGymModal(gym || gyms[0] || null);
    setModalTab(tab);
  };

  return (
    <div className="d-flex flex-column gap-4">
      {/* Header Banner */}
      <div className="glass-card p-4 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 position-relative overflow-hidden">
        <div>
          <span className="badge badge-active mb-2">Member Portal</span>
          <h3 className="text-white font-weight-bold mb-1">Welcome back, {member.full_name}! 👋</h3>
          <p className="text-muted mb-0">Today is <strong className="text-cyan">{todayDay}</strong>. Let's conquer your workout and nutrition goals!</p>
        </div>
        <button
          onClick={() => navigate('/member/tracker')}
          className="btn btn-primary-gradient d-flex align-items-center gap-2"
        >
          <FiCheckSquare size={18} />
          <span>Open Today's Checklist</span>
        </button>
      </div>

      {/* Gym Centers & Slot Booking Highlight - Located First */}
      <div className="glass-card-static p-4 border border-primary border-opacity-25">
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-3">
          <div>
            <h4 className="text-white font-weight-bold mb-1 d-flex align-items-center gap-2">
              <FiMapPin className="text-cyan" /> Gym Centers & Slot Booking
            </h4>
            <p className="text-muted small mb-0">Explore Gymkhana locations, view place details, membership plans & available time slots.</p>
          </div>
          <button
            onClick={() => handleOpenGymModal(gyms[0], 'ALL_CENTERS')}
            className="btn btn-secondary-glass btn-sm text-nowrap"
          >
            All Centers ({gyms.length}) →
          </button>
        </div>

        {/* Active Gym Passes Banner if available */}
        {activeBookings.length > 0 && (
          <div className="glass-card p-3 rounded-3 mb-4 border border-success border-opacity-50 bg-success bg-opacity-10">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
              <div className="d-flex align-items-center gap-2">
                <FiCheckCircle className="text-success" size={20} />
                <div>
                  <span className="text-white font-weight-bold d-block small">My Subscription & Active Gym Pass</span>
                  <small className="text-muted">
                    {activeBookings[0].gym_name} ({activeBookings[0].gym_place}) • {activeBookings[0].booking_date} @ {activeBookings[0].slot_time}
                  </small>
                </div>
              </div>
              <button
                onClick={() => setViewPassBooking(activeBookings[0])}
                className="btn btn-cyan-gradient btn-sm d-flex align-items-center gap-2"
              >
                <FiGrid size={14} />
                <span>View Digital Pass ({activeBookings[0].pass_code})</span>
              </button>
            </div>
          </div>
        )}

        {/* Detailed Gym Center Cards */}
        <div className="row g-3">
          {gyms.slice(0, 3).map((gym) => (
            <div key={gym.id} className="col-12 col-md-4">
              <div className="glass-card p-3 rounded-3 h-100 d-flex flex-column justify-content-between border border-secondary border-opacity-25 hover-lift">
                <div>
                  {/* Gym City & Rating Header */}
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="badge badge-active">📍 {gym.city}</span>
                    <small className="text-warning fw-bold d-flex align-items-center gap-1">
                      <FiStar size={12} fill="#EAB308" /> {gym.rating}
                    </small>
                  </div>
                  
                  {/* Gym Name & Place */}
                  <h6 className="text-white font-weight-bold mb-1">{gym.name}</h6>
                  <p className="text-cyan small mb-1 fw-semibold" style={{ fontSize: '0.82rem' }}>
                    <FiNavigation className="me-1" size={12} />
                    Place: {gym.place || gym.address}
                  </p>
                  
                  <small className="text-muted d-block mb-2 text-truncate">
                    <FiMapPin size={11} className="me-1" />
                    {gym.address} {gym.landmark && `• (${gym.landmark})`}
                  </small>

                  {/* Hours & Contact */}
                  <div className="d-flex flex-wrap align-items-center gap-2 text-muted small mb-2 glass-card-static p-2 rounded-2" style={{ fontSize: '0.75rem' }}>
                    <span className="d-flex align-items-center gap-1 text-truncate">
                      <FiClock size={11} className="text-cyan" /> {gym.operating_hours}
                    </span>
                    <span className="d-flex align-items-center gap-1 text-truncate">
                      <FiPhone size={11} className="text-cyan" /> {gym.phone}
                    </span>
                  </div>

                  {/* Plans & Pricing Badges */}
                  {gym.plans && gym.plans.length > 0 && (
                    <div className="mb-2">
                      <small className="text-white d-block mb-1 fw-semibold" style={{ fontSize: '0.73rem' }}>
                        <FiDollarSign size={11} className="text-success me-1" />
                        Membership Plans:
                      </small>
                      <div className="d-flex flex-wrap gap-1">
                        {gym.plans.map((p, pIdx) => (
                          <span 
                            key={pIdx} 
                            className="badge bg-dark border border-primary border-opacity-25 text-white" 
                            style={{ fontSize: '0.68rem' }}
                          >
                            {p.title}: <strong className="text-cyan">${p.price}</strong>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Available Time Slots */}
                  {gym.available_slots && (
                    <div className="mb-2">
                      <small className="text-muted d-block mb-1 fw-semibold" style={{ fontSize: '0.73rem' }}>Available Time Slots:</small>
                      <div className="d-flex flex-wrap gap-1">
                        {gym.available_slots.slice(0, 3).map((s, sIdx) => (
                          <span key={sIdx} className="badge badge-role" style={{ fontSize: '0.65rem' }}>
                            🕒 {s.split(' - ')[0]}
                          </span>
                        ))}
                        {gym.available_slots.length > 3 && (
                          <span className="badge bg-secondary text-white" style={{ fontSize: '0.65rem' }}>
                            +{gym.available_slots.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Facilities Badges */}
                  {gym.facilities && (
                    <div>
                      <small className="text-muted d-block mb-1 fw-semibold" style={{ fontSize: '0.73rem' }}>Facilities:</small>
                      <div className="d-flex flex-wrap gap-1">
                        {gym.facilities.slice(0, 3).map((f, fIdx) => (
                          <span key={fIdx} className="badge badge-role" style={{ fontSize: '0.65rem' }}>
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="d-flex gap-2 mt-3 pt-2 border-top border-secondary border-opacity-25">
                  <button
                    onClick={() => handleOpenGymModal(gym, 'OVERVIEW')}
                    className="btn btn-secondary-glass btn-sm flex-fill"
                    style={{ fontSize: '0.8rem' }}
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleOpenGymModal(gym, 'BOOK')}
                    className="btn btn-primary-gradient btn-sm flex-fill"
                    style={{ fontSize: '0.8rem' }}
                  >
                    Book Slot
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subscription Status Card Module */}
      <div className="row g-3">
        <div className="col-12 col-md-4">
          <div className="glass-card-static p-4 h-100 d-flex flex-column justify-content-between">
            <div>
              <span className="text-muted text-uppercase fw-semibold" style={{ fontSize: '0.78rem' }}>
                Subscription Plan Status
              </span>
              <h3 className="text-white font-weight-bold mt-2 mb-1">{subscription.plan_title || 'No Plan Active'}</h3>
              <div className="mt-2 mb-3">
                {subscription.status === 'ACTIVE' && (
                  <span className="badge badge-status badge-active">ACTIVE MEMBER</span>
                )}
                {subscription.status === 'EXPIRING_SOON' && (
                  <span className="badge badge-status badge-expiring">EXPIRING SOON</span>
                )}
                {(!subscription.status || subscription.status === 'EXPIRED') && (
                  <span className="badge badge-status badge-expired">EXPIRED</span>
                )}
              </div>
            </div>
            <div className="pt-3 border-top border-secondary border-opacity-25 d-flex align-items-center justify-content-between">
              <span className="text-muted small">
                <FiClock className="me-1 text-cyan" />
                {subscription.days_remaining || 0} Days Remaining
              </span>
              <button
                onClick={() => navigate('/member/subscription')}
                className="btn btn-link text-cyan p-0 small fw-bold text-decoration-none"
              >
                View Plan →
              </button>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <StatCard
            title="Today's Workout Target"
            value={`${todaysExercises.length} Exercises`}
            icon={FiActivity}
            color="#4F46E5"
            subtitle={`Scheduled for ${todayDay}`}
          />
        </div>

        <div className="col-12 col-md-4">
          <StatCard
            title="Today's Meal Routine"
            value={`${todaysMeals.length} Meals`}
            icon={FiPieChart}
            color="#22C55E"
            subtitle={`Scheduled for ${todayDay}`}
          />
        </div>
      </div>

      {/* Today's Checklist Highlights */}
      <div className="row g-4">
        {/* Workout Checklist */}
        <div className="col-12 col-lg-6">
          <div className="glass-card-static p-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="text-white font-weight-bold mb-0 d-flex align-items-center gap-2">
                <FiActivity className="text-primary" /> Today's Workout Routine ({todayDay})
              </h5>
              <button
                onClick={() => navigate('/member/workout')}
                className="btn btn-secondary-glass btn-sm"
              >
                Full Routine
              </button>
            </div>

            {todaysExercises.length === 0 ? (
              <div className="p-4 text-center text-muted">
                No exercises scheduled for {todayDay}. Rest & Recovery Day!
              </div>
            ) : (
              <div className="d-flex flex-column gap-2">
                {todaysExercises.map((ex) => (
                  <div key={ex.id} className="p-3 glass-card rounded-3 d-flex align-items-center justify-content-between">
                    <div>
                      <h6 className="text-white font-weight-bold mb-0">{ex.exercise_name}</h6>
                      <small className="text-muted">Target: {ex.target_muscle}</small>
                    </div>
                    <div className="text-end">
                      <span className="badge badge-role">{ex.sets} Sets × {ex.reps}</span>
                      <small className="d-block text-muted mt-1">{ex.rest_seconds}s Rest</small>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Meal Checklist */}
        <div className="col-12 col-lg-6">
          <div className="glass-card-static p-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="text-white font-weight-bold mb-0 d-flex align-items-center gap-2">
                <FiPieChart className="text-success" /> Today's Meals ({todayDay})
              </h5>
              <button
                onClick={() => navigate('/member/diet')}
                className="btn btn-secondary-glass btn-sm"
              >
                Full Diet
              </button>
            </div>

            {todaysMeals.length === 0 ? (
              <div className="p-4 text-center text-muted">
                No custom meals logged for {todayDay}.
              </div>
            ) : (
              <div className="d-flex flex-column gap-2">
                {todaysMeals.map((m) => (
                  <div key={m.id} className="p-3 glass-card rounded-3 d-flex align-items-center justify-content-between">
                    <div>
                      <span className="badge badge-active mb-1">{m.meal_time}</span>
                      <h6 className="text-white font-weight-bold mb-0">{m.meal_name}</h6>
                    </div>
                    <div className="text-end">
                      <span className="text-cyan fw-bold d-block">{m.calories} kcal</span>
                      <small className="text-muted">P: {m.protein}g | C: {m.carbs}g | F: {m.fat}g</small>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress Chart */}
      <div className="glass-card-static p-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h4 className="text-white font-weight-bold mb-0">Weight & BMI Trend</h4>
          <button
            onClick={() => navigate('/member/progress')}
            className="btn btn-cyan-gradient btn-sm d-flex align-items-center gap-1"
          >
            <span>Log Today's Weight</span>
            <FiArrowRight size={14} />
          </button>
        </div>
        <ProgressAnalyticsChart
          labels={progressSummary.labels}
          weightData={progressSummary.weight_trend}
          bmiData={progressSummary.bmi_trend}
        />
      </div>

      {/* Interactive Gym Details & Slot Booking Modal */}
      {activeGymModal && (
        <GymDetailsModal
          gym={activeGymModal}
          allGyms={gyms}
          initialTab={modalTab}
          onClose={() => setActiveGymModal(null)}
          onBookingSuccess={() => {
            refetch();
          }}
        />
      )}

      {/* Standalone Digital Entry Pass Modal */}
      {viewPassBooking && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center z-3 p-3" 
          style={{ background: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(10px)' }}
        >
          <div className="glass-card p-4 p-sm-5 w-100 text-center position-relative" style={{ maxWidth: '460px', borderRadius: '24px' }}>
            <button 
              onClick={() => setViewPassBooking(null)} 
              className="btn-close btn-close-white position-absolute top-0 end-0 m-4" 
            />

            <div className="mb-3">
              <span className="badge badge-active mb-2">OFFICIAL GYMKHANA ENTRY PASS</span>
              <h4 className="text-white font-weight-bold mb-1">{viewPassBooking.gym_name}</h4>
              <p className="text-cyan small mb-0">📍 {viewPassBooking.gym_place || viewPassBooking.gym_address}</p>
            </div>

            <div className="glass-card-static p-4 rounded-3 border border-success border-opacity-50 my-3 position-relative overflow-hidden">
              <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                <FiGrid size={48} className="text-cyan" />
              </div>
              <span className="badge bg-dark text-cyan font-monospace px-3 py-2 fs-6 tracking-wider d-inline-block mb-3 border border-cyan border-opacity-25">
                {viewPassBooking.pass_code}
              </span>

              <div className="text-start glass-card p-3 rounded-2 text-muted small d-flex flex-column gap-2">
                <div className="d-flex justify-content-between">
                  <span>Pass Type / Plan:</span>
                  <strong className="text-white">{viewPassBooking.plan_title || 'Day Pass'}</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Booking Date:</span>
                  <strong className="text-white">{viewPassBooking.booking_date}</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Time Slot:</span>
                  <strong className="text-cyan">{viewPassBooking.slot_time}</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Access Area:</span>
                  <strong className="text-white">{viewPassBooking.workout_type}</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Status:</span>
                  <span className="badge badge-status badge-active">{viewPassBooking.status}</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setViewPassBooking(null)}
              className="btn btn-primary-gradient w-100"
            >
              Done / Close Pass
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
