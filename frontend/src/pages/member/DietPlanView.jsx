import React from 'react';
import { useFetch } from '../../hooks/useFetch';
import { SkeletonLoader } from '../../components/SkeletonLoader';
import { FiPieChart, FiCoffee, FiSun, FiMoon } from 'react-icons/fi';

export const DietPlanView = () => {
  const { data, loading } = useFetch('/diets');

  if (loading) return <SkeletonLoader count={2} height="140px" />;

  const dietPlans = data?.diet_plans || [];
  const activePlan = dietPlans[0];

  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

  return (
    <div className="d-flex flex-column gap-4">
      <div>
        <h3 className="text-white font-weight-bold mb-1">My Diet & Nutrition Plan</h3>
        <p className="text-muted mb-0">Target macronutrients and meal breakdowns customized for your fitness goal.</p>
      </div>

      {!activePlan ? (
        <div className="glass-card-static p-4 text-center text-muted">
          No diet plan assigned yet. Your coach will prepare a macro-targeted plan soon!
        </div>
      ) : (
        <div className="d-flex flex-column gap-4">
          {/* Target Macro Summary */}
          <div className="glass-card p-4">
            <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-3">
              <div>
                <h4 className="text-white font-weight-bold mb-1">{activePlan.title}</h4>
                <p className="text-muted mb-0">{activePlan.description || 'Target macro breakdown.'}</p>
              </div>
              <div className="p-3 glass-card-static rounded-3 text-center">
                <span className="text-muted small d-block">Daily Calorie Goal</span>
                <h3 className="text-cyan font-weight-bold mb-0">{activePlan.daily_calorie_target} kcal</h3>
              </div>
            </div>

            {/* Macro Pill Cards */}
            <div className="row g-3">
              <div className="col-4">
                <div className="p-3 glass-card-static rounded-3 text-center">
                  <small className="text-muted">Protein</small>
                  <h4 className="text-primary font-weight-bold mb-0 mt-1">{activePlan.protein_target_g}g</h4>
                </div>
              </div>
              <div className="col-4">
                <div className="p-3 glass-card-static rounded-3 text-center">
                  <small className="text-muted">Carbohydrates</small>
                  <h4 className="text-success font-weight-bold mb-0 mt-1">{activePlan.carbs_target_g}g</h4>
                </div>
              </div>
              <div className="col-4">
                <div className="p-3 glass-card-static rounded-3 text-center">
                  <small className="text-muted">Fats</small>
                  <h4 className="text-warning font-weight-bold mb-0 mt-1">{activePlan.fat_target_g}g</h4>
                </div>
              </div>
            </div>
          </div>

          {/* Meals by Day */}
          <div className="row g-4">
            {days.map((day) => {
              const dayMeals = (activePlan.meals || []).filter((m) => m.day_of_week === day);
              return (
                <div key={day} className="col-12 col-md-6 col-lg-4">
                  <div className="glass-card-static p-4 h-100">
                    <div className="d-flex align-items-center justify-content-between mb-3 border-bottom border-secondary border-opacity-25 pb-2">
                      <h5 className="text-white font-weight-bold mb-0">{day}</h5>
                      <span className="badge badge-active">{dayMeals.length} Meals</span>
                    </div>

                    {dayMeals.length === 0 ? (
                      <p className="text-muted small">Standard Daily Macros Apply</p>
                    ) : (
                      <div className="d-flex flex-column gap-2">
                        {dayMeals.map((m) => (
                          <div key={m.id} className="p-3 glass-card rounded-3">
                            <span className="badge badge-active mb-1" style={{ fontSize: '0.65rem' }}>{m.meal_time}</span>
                            <h6 className="text-white font-weight-bold mb-1">{m.meal_name}</h6>
                            <div className="d-flex justify-content-between text-muted small border-top border-secondary border-opacity-25 pt-2 mt-2">
                              <span className="text-cyan fw-bold">{m.calories} kcal</span>
                              <span>P:{m.protein}g C:{m.carbs}g F:{m.fat}g</span>
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
