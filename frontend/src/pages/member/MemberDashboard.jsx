import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { SkeletonLoader } from '../../components/SkeletonLoader';
import { StatCard } from '../../components/StatCard';
import { ProgressAnalyticsChart } from '../../components/ProgressAnalyticsChart';
import { FiCalendar, FiClock, FiActivity, FiPieChart, FiCheckSquare, FiArrowRight, FiMapPin } from 'react-icons/fi';

export const MemberDashboard = () => {
  const { data, loading, error } = useFetch('/member/dashboard');
  const navigate = useNavigate();

  if (loading) return <SkeletonLoader count={3} height="140px" />;
  if (error) return <div className="alert alert-danger">{error}</div>;

  const member = data?.member || {};
  const subscription = data?.subscription || {};
  const todayDay = data?.today_day || 'MONDAY';
  const todaysExercises = data?.todays_exercises || [];
  const todaysMeals = data?.todays_meals || [];
  const progressSummary = data?.progress_summary || {};

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

      {/* Subscription Status Card Module 5 */}
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

      {/* Gym Locations & Slot Booking Highlight */}
      <div className="glass-card-static p-4">
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-3">
          <div>
            <h4 className="text-white font-weight-bold mb-1 d-flex align-items-center gap-2">
              <FiMapPin className="text-cyan" /> Gym Centers & Slot Booking
            </h4>
            <p className="text-muted small mb-0">Explore Gymkhana locations, view available amenities, and reserve training slots.</p>
          </div>
          <button
            onClick={() => navigate('/member/gyms')}
            className="btn btn-primary-gradient btn-sm d-flex align-items-center gap-2 text-nowrap"
          >
            <FiCalendar size={16} />
            <span>Book Gym Slot</span>
          </button>
        </div>

        <div className="row g-3">
          {(data?.gyms || []).slice(0, 3).map((gym) => (
            <div key={gym.id} className="col-12 col-md-4">
              <div className="glass-card p-3 rounded-3 h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="badge badge-active">{gym.city}</span>
                    <small className="text-warning fw-bold">★ {gym.rating}</small>
                  </div>
                  <h6 className="text-white font-weight-bold mb-1">{gym.name}</h6>
                  <small className="text-muted d-block mb-2">{gym.address}</small>
                </div>
                <button
                  onClick={() => navigate('/member/gyms')}
                  className="btn btn-secondary-glass btn-sm w-100 mt-2"
                >
                  View Slots & Book →
                </button>
              </div>
            </div>
          ))}
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
    </div>
  );
};
