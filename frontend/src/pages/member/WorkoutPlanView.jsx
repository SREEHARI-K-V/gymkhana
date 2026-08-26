import React from 'react';
import { useFetch } from '../../hooks/useFetch';
import { SkeletonLoader } from '../../components/SkeletonLoader';
import { FiActivity, FiClock, FiRepeat } from 'react-icons/fi';

export const WorkoutPlanView = () => {
  const { data, loading } = useFetch('/workouts');

  if (loading) return <SkeletonLoader count={2} height="140px" />;

  const workoutPlans = data?.workout_plans || [];
  const activePlan = workoutPlans[0]; // latest plan

  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

  return (
    <div className="d-flex flex-column gap-4">
      <div>
        <h3 className="text-white font-weight-bold mb-1">My Personal Workout Routine</h3>
        <p className="text-muted mb-0">Structured training program assigned by your Gymkhana coach.</p>
      </div>

      {!activePlan ? (
        <div className="glass-card-static p-4 text-center text-muted">
          No workout routine assigned yet. Your coach will upload a custom routine soon!
        </div>
      ) : (
        <div className="d-flex flex-column gap-4">
          <div className="glass-card p-4">
            <h4 className="text-white font-weight-bold mb-1">{activePlan.title}</h4>
            <p className="text-muted mb-2">{activePlan.description || 'No description provided.'}</p>
            <small className="text-cyan fw-semibold">
              Coach: {activePlan.creator_name || 'Personal Coach'}
            </small>
          </div>

          {/* Days Accordion / Cards */}
          <div className="row g-3 g-md-4">
            {days.map((day) => {
              const dayExercises = (activePlan.exercises || []).filter((ex) => ex.day_of_week === day);
              return (
                <div key={day} className="col-12 col-sm-6 col-lg-4">
                  <div className="glass-card-static p-4 h-100">
                    <div className="d-flex align-items-center justify-content-between mb-3 border-bottom border-secondary border-opacity-25 pb-2">
                      <h5 className="text-white font-weight-bold mb-0">{day}</h5>
                      <span className="badge badge-active">{dayExercises.length} Exercises</span>
                    </div>

                    {dayExercises.length === 0 ? (
                      <p className="text-muted small">Rest & Active Recovery Day</p>
                    ) : (
                      <div className="d-flex flex-column gap-2">
                        {dayExercises.map((ex) => (
                          <div key={ex.id} className="p-3 glass-card rounded-3">
                            <h6 className="text-white font-weight-bold mb-1">{ex.exercise_name}</h6>
                            <small className="text-cyan d-block mb-2">Target: {ex.target_muscle}</small>
                            <div className="d-flex justify-content-between text-muted small border-top border-secondary border-opacity-25 pt-2">
                              <span><FiRepeat className="me-1" />{ex.sets} sets × {ex.reps}</span>
                              <span><FiClock className="me-1" />{ex.rest_seconds}s rest</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
