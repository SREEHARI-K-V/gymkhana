import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { SkeletonLoader } from '../../components/SkeletonLoader';
import { StatCard } from '../../components/StatCard';
import { ProgressAnalyticsChart } from '../../components/ProgressAnalyticsChart';
import { GymDetailsModal } from '../../components/GymDetailsModal';
import { 
  FiCalendar, FiClock, FiActivity, FiPieChart, FiCheckSquare, 
  FiArrowRight, FiMapPin, FiNavigation, FiDollarSign, FiStar, 
  FiCheckCircle, FiGrid, FiPhone, FiUser, FiCreditCard, 
  FiZap, FiTrendingUp, FiBell, FiShield, FiFileText, FiMessageSquare
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
  const notificationsCount = data?.notifications_count || 0;
  const recentNotifications = data?.recent_notifications || [];

  const handleOpenGymModal = (gym = null, tab = 'OVERVIEW') => {
    setActiveGymModal(gym || gyms[0] || null);
    setModalTab(tab);
  };

  // 11 Core Member Features Definition
  const memberFeatures = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      desc: 'Central command with daily fitness routines, active passes & health stats.',
      icon: FiGrid,
      color: '#6366F1',
      badge: 'Live Overview',
      route: '/member',
      isCurrent: true
    },
    {
      id: 'profile',
      title: 'My Profile',
      desc: 'Biometrics, emergency contact, coach assignment & digital member ID card.',
      icon: FiUser,
      color: '#06B6D4',
      badge: member.member_code || 'GK-MEM-1049',
      route: '/member/profile'
    },
    {
      id: 'membership',
      title: 'Membership & Renewal',
      desc: 'Current plan status, renewal options, upgrade tiers & access perks.',
      icon: FiCreditCard,
      color: '#10B981',
      badge: `${subscription.days_remaining || 0} Days Left`,
      route: '/member/membership'
    },
    {
      id: 'payments',
      title: 'Payment History',
      desc: 'Transaction receipts, tax invoices, payment methods & lifetime billing logs.',
      icon: FiDollarSign,
      color: '#F59E0B',
      badge: 'Verified Invoices',
      route: '/member/payments'
    },
    {
      id: 'workout',
      title: 'Workout Plan',
      desc: 'Personalized 7-day routine, exercise instructions, sets, reps & rest timers.',
      icon: FiActivity,
      color: '#8B5CF6',
      badge: `${todaysExercises.length} Exercises Today`,
      route: '/member/workout'
    },
    {
      id: 'ai-workout-finder',
      title: 'AI Workout Finder',
      desc: 'Dynamic AI routine synthesis matching equipment, intensity, focus & duration.',
      icon: FiZap,
      color: '#EC4899',
      badge: 'AI v2.4 Engine',
      route: '/member/ai-workout-finder'
    },
    {
      id: 'diet',
      title: 'Diet Plan',
      desc: 'Target calorie metrics, macronutrient split (P/C/F) & scheduled meals.',
      icon: FiPieChart,
      color: '#22C55E',
      badge: `${todaysMeals.length} Meals Logged`,
      route: '/member/diet'
    },
    {
      id: 'progress',
      title: 'Fitness Progress',
      desc: 'Weight & BMI analytics charts, circumference measurements & goal history.',
      icon: FiTrendingUp,
      color: '#3B82F6',
      badge: 'Analytics Active',
      route: '/member/progress'
    },
    {
      id: 'branches',
      title: 'Gym Branches',
      desc: 'Multi-city facility network, equipment zones, operating hours & slot booking.',
      icon: FiMapPin,
      color: '#14B8A6',
      badge: `${gyms.length} Centers Open`,
      route: '/member/branches'
    },
    {
      id: 'feedback',
      title: 'Feedback & Reviews',
      desc: 'Community athlete reviews, facility ratings & direct feedback to coaches.',
      icon: FiStar,
      color: '#EAB308',
      badge: '4.9 ★ Community',
      route: '/member/feedback'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      desc: 'Instant updates on workout tweaks, subscription expiry alerts & slot passes.',
      icon: FiBell,
      color: '#F43F5E',
      badge: `${notificationsCount} New Alerts`,
      route: '/member/notifications'
    }
  ];

  return (
    <div className="d-flex flex-column gap-4">
      {/* Header Banner */}
      <div className="glass-card p-4 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 position-relative overflow-hidden">
        <div>
          <div className="d-flex align-items-center gap-2 mb-2">
            <span className="badge badge-active">Member Portal</span>
            {notificationsCount > 0 && (
              <span 
                onClick={() => navigate('/member/notifications')}
                className="badge bg-danger text-white cursor-pointer d-flex align-items-center gap-1"
                style={{ cursor: 'pointer' }}
              >
                <FiBell size={12} /> {notificationsCount} Alerts
              </span>
            )}
          </div>
          <h3 className="text-white font-weight-bold mb-1">Welcome back, {member.full_name}! 👋</h3>
          <p className="text-muted mb-0">Today is <strong className="text-cyan">{todayDay}</strong>. Your membership is active and all features are ready.</p>
        </div>

        <div className="d-flex flex-wrap gap-2 align-self-start align-self-md-center">
          <button
            onClick={() => navigate('/member/ai-workout-finder')}
            className="btn btn-secondary-glass d-flex align-items-center gap-2"
          >
            <FiZap size={16} className="text-cyan" />
            <span>AI Workout Finder</span>
          </button>
          <button
            onClick={() => navigate('/member/tracker')}
            className="btn btn-primary-gradient d-flex align-items-center gap-2"
          >
            <FiCheckSquare size={16} />
            <span>Today's Checklist</span>
          </button>
        </div>
      </div>

      {/* Feature Showcase Grid (All 11 Features) */}
      <div className="glass-card-static p-4 border border-primary border-opacity-25">
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2 mb-3">
          <div>
            <h4 className="text-white font-weight-bold mb-1 d-flex align-items-center gap-2">
              <FiShield className="text-cyan" /> Member Features Hub
            </h4>
            <p className="text-muted small mb-0">Access all 11 core member tools, workouts, billing, and gym facilities.</p>
          </div>
          <span className="badge badge-role align-self-start align-self-md-center">11 Features Available</span>
        </div>

        <div className="row g-3">
          {memberFeatures.map((feat) => {
            const Icon = feat.icon;
            return (
              <div key={feat.id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
                <div 
                  onClick={() => navigate(feat.route)}
                  className="glass-card p-3 rounded-3 h-100 d-flex flex-column justify-content-between border border-secondary border-opacity-25 hover-lift transition-all cursor-pointer"
                  style={{ cursor: 'pointer' }}
                >
                  <div>
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div 
                        className="rounded-3 p-2 d-flex align-items-center justify-content-center text-white shadow-sm"
                        style={{ backgroundColor: `${feat.color}25`, border: `1px solid ${feat.color}50` }}
                      >
                        <Icon size={20} style={{ color: feat.color }} />
                      </div>
                      <span className="badge badge-role" style={{ fontSize: '0.68rem' }}>
                        {feat.badge}
                      </span>
                    </div>

                    <h6 className="text-white font-weight-bold mb-1">{feat.title}</h6>
                    <p className="text-muted small mb-3" style={{ fontSize: '0.8rem', lineHeight: '1.4' }}>
                      {feat.desc}
                    </p>
                  </div>

                  <div className="pt-2 border-top border-secondary border-opacity-25 d-flex align-items-center justify-content-between">
                    <span className="text-cyan small fw-semibold" style={{ fontSize: '0.78rem' }}>
                      {feat.isCurrent ? 'Viewing Now' : 'Launch Feature'}
                    </span>
                    <FiArrowRight size={14} className="text-cyan" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Subscription Status & Quick Metric Cards */}
      <div className="row g-3">
        <div className="col-12 col-sm-6 col-lg-4">
          <div className="glass-card-static p-4 h-100 d-flex flex-column justify-content-between">
            <div>
              <span className="text-muted text-uppercase fw-semibold" style={{ fontSize: '0.78rem' }}>
                Subscription Plan Status
              </span>
              <h3 className="text-white font-weight-bold mt-2 mb-1">{subscription.plan_title || 'Pro Performance Plan'}</h3>
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
                onClick={() => navigate('/member/membership')}
                className="btn btn-link text-cyan p-0 small fw-bold text-decoration-none"
              >
                Renew Plan →
              </button>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-4">
          <StatCard
            title="Today's Workout Target"
            value={`${todaysExercises.length} Exercises`}
            icon={FiActivity}
            color="#4F46E5"
            subtitle={`Scheduled for ${todayDay}`}
          />
        </div>

        <div className="col-12 col-sm-12 col-lg-4">
          <StatCard
            title="Today's Meal Routine"
            value={`${todaysMeals.length} Meals`}
            icon={FiPieChart}
            color="#22C55E"
            subtitle={`Scheduled for ${todayDay}`}
          />
        </div>
      </div>

      {/* Gym Centers & Active Entry Passes */}
      <div className="glass-card-static p-3 p-sm-4 border border-primary border-opacity-25">
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-3">
          <div>
            <h4 className="text-white font-weight-bold mb-1 d-flex align-items-center gap-2">
              <FiMapPin className="text-cyan" /> Gym Branches & Slot Passes
            </h4>
            <p className="text-muted small mb-0">Explore locations, reserve time slots, and access digital check-in passes.</p>
          </div>
          <button
            onClick={() => navigate('/member/branches')}
            className="btn btn-secondary-glass btn-sm text-nowrap align-self-start align-self-md-center"
          >
            All Branches ({gyms.length}) →
          </button>
        </div>

        {/* Active Gym Passes Banner */}
        {activeBookings.length > 0 && (
          <div className="glass-card p-3 rounded-3 mb-4 border border-success border-opacity-50 bg-success bg-opacity-10">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
              <div className="d-flex align-items-center gap-2">
                <FiCheckCircle className="text-success flex-shrink-0" size={20} />
                <div>
                  <span className="text-white font-weight-bold d-block small">My Active Gym Pass</span>
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
            <div key={gym.id} className="col-12 col-md-6 col-lg-4">
              <div className="glass-card p-3 rounded-3 h-100 d-flex flex-column justify-content-between border border-secondary border-opacity-25 hover-lift">
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="badge badge-active">📍 {gym.city}</span>
                    <small className="text-warning fw-bold d-flex align-items-center gap-1">
                      <FiStar size={12} fill="#EAB308" /> {gym.rating}
                    </small>
                  </div>
                  
                  <h6 className="text-white font-weight-bold mb-1">{gym.name}</h6>
                  <p className="text-cyan small mb-1 fw-semibold" style={{ fontSize: '0.82rem' }}>
                    <FiNavigation className="me-1" size={12} /> Place: {gym.place || gym.address}
                  </p>
                  
                  <small className="text-muted d-block mb-2 text-truncate">
                    <FiMapPin size={11} className="me-1" /> {gym.address}
                  </small>

                  <div className="d-flex flex-wrap align-items-center gap-2 text-muted small mb-2 glass-card-static p-2 rounded-2" style={{ fontSize: '0.75rem' }}>
                    <span className="d-flex align-items-center gap-1 text-truncate">
                      <FiClock size={11} className="text-cyan" /> {gym.operating_hours}
                    </span>
                    <span className="d-flex align-items-center gap-1 text-truncate">
                      <FiPhone size={11} className="text-cyan" /> {gym.phone}
                    </span>
                  </div>
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

      {/* Today's Dual Checklist (Workout & Meals) */}
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

      {/* Recent Notifications Teaser */}
      {recentNotifications.length > 0 && (
        <div className="glass-card-static p-4">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h5 className="text-white font-weight-bold mb-0 d-flex align-items-center gap-2">
              <FiBell className="text-cyan" /> Recent Member Notifications
            </h5>
            <button
              onClick={() => navigate('/member/notifications')}
              className="btn btn-secondary-glass btn-sm"
            >
              All Notifications →
            </button>
          </div>

          <div className="d-flex flex-column gap-2">
            {recentNotifications.map((notif) => (
              <div key={notif.id} className="p-3 glass-card rounded-3 d-flex align-items-center justify-content-between gap-3">
                <div className="d-flex align-items-center gap-2">
                  <div className="p-2 bg-dark rounded-circle text-cyan">
                    <FiBell size={14} />
                  </div>
                  <div>
                    <h6 className="text-white fw-bold mb-0" style={{ fontSize: '0.88rem' }}>{notif.title}</h6>
                    <small className="text-muted">{notif.message}</small>
                  </div>
                </div>
                <small className="text-muted flex-shrink-0">{notif.created_at}</small>
              </div>
            ))}
          </div>
        </div>
      )}

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
