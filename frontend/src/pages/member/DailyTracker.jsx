import React, { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { SkeletonLoader } from '../../components/SkeletonLoader';
import { useNotification } from '../../context/NotificationContext';
import { FiCheckSquare, FiSquare, FiActivity, FiPieChart } from 'react-icons/fi';

export const DailyTracker = () => {
  const { data, loading } = useFetch('/member/dashboard');
  const { addToast } = useNotification();
  
  const [completedExercises, setCompletedExercises] = useState({});
  const [completedMeals, setCompletedMeals] = useState({});

  if (loading) return <SkeletonLoader count={2} height="120px" />;

  const todayDay = data?.today_day || 'MONDAY';
  const todaysExercises = data?.todays_exercises || [];
  const todaysMeals = data?.todays_meals || [];

  const toggleExercise = (id) => {
    setCompletedExercises((prev) => {
      const nextState = !prev[id];
      if (nextState) addToast('Exercise marked as completed! Keep going! 💪', 'success');
      return { ...prev, [id]: nextState };
    });
  };

  const toggleMeal = (id) => {
    setCompletedMeals((prev) => {
      const nextState = !prev[id];
      if (nextState) addToast('Meal logged as eaten! 🥗', 'info');
      return { ...prev, [id]: nextState };
    });
  };

  return (
    <div className="d-flex flex-column gap-4">
      <div>
        <h3 className="text-white font-weight-bold mb-1">Today's Interactive Checklist ({todayDay})</h3>
        <p className="text-muted mb-0">Check off exercises and meals as you complete them throughout the day.</p>
      </div>

      <div className="row g-4">
        {/* Exercises Checklist */}
        <div className="col-12 col-md-6">
          <div className="glass-card-static p-4 h-100">
            <h5 className="text-white font-weight-bold mb-3 d-flex align-items-center gap-2">
              <FiActivity className="text-primary" /> Today's Exercises Checklist
            </h5>

            {todaysExercises.length === 0 ? (
              <p className="text-muted">No exercises assigned for today. Rest day!</p>
            ) : (
              <div className="d-flex flex-column gap-3">
                {todaysExercises.map((ex) => {
                  const done = completedExercises[ex.id];
                  return (
                    <div
                      key={ex.id}
                      onClick={() => toggleExercise(ex.id)}
                      className={`p-3 glass-card rounded-3 d-flex align-items-center justify-content-between cursor-pointer border ${
                        done ? 'border-success bg-success bg-opacity-10' : ''
                      }`}
                      style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                    >
                      <div className="d-flex align-items-center gap-3">
                        {done ? (
                          <FiCheckSquare color="#22C55E" size={24} />
                        ) : (
                          <FiSquare color="#94A3B8" size={24} />
                        )}
                        <div>
                          <h6 className={`mb-0 ${done ? 'text-decoration-line-through text-muted' : 'text-white font-weight-bold'}`}>
                            {ex.exercise_name}
                          </h6>
                          <small className="text-muted">{ex.target_muscle} • Rest: {ex.rest_seconds}s</small>
                        </div>
                      </div>
                      <span className="badge badge-role">{ex.sets} Sets × {ex.reps}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Meals Checklist */}
        <div className="col-12 col-md-6">
          <div className="glass-card-static p-4 h-100">
            <h5 className="text-white font-weight-bold mb-3 d-flex align-items-center gap-2">
              <FiPieChart className="text-success" /> Today's Nutrition Checklist
            </h5>

            {todaysMeals.length === 0 ? (
              <p className="text-muted">No meals logged for today.</p>
            ) : (
              <div className="d-flex flex-column gap-3">
                {todaysMeals.map((m) => {
                  const done = completedMeals[m.id];
                  return (
                    <div
                      key={m.id}
                      onClick={() => toggleMeal(m.id)}
                      className={`p-3 glass-card rounded-3 d-flex align-items-center justify-content-between border ${
                        done ? 'border-success bg-success bg-opacity-10' : ''
                      }`}
                      style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                    >
                      <div className="d-flex align-items-center gap-3">
                        {done ? (
                          <FiCheckSquare color="#22C55E" size={24} />
                        ) : (
                          <FiSquare color="#94A3B8" size={24} />
                        )}
                        <div>
                          <span className="badge badge-active mb-1" style={{ fontSize: '0.65rem' }}>{m.meal_time}</span>
                          <h6 className={`mb-0 ${done ? 'text-decoration-line-through text-muted' : 'text-white font-weight-bold'}`}>
                            {m.meal_name}
                          </h6>
                        </div>
                      </div>
                      <span className="text-cyan fw-bold">{m.calories} kcal</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
