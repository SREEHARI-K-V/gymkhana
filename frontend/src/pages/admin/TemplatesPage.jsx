import React, { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { SkeletonLoader } from '../../components/SkeletonLoader';
import { FiActivity, FiPieChart, FiCopy } from 'react-icons/fi';

export const TemplatesPage = () => {
  const { data: workoutsData, loading: wLoading } = useFetch('/workouts?is_template=true');
  const { data: dietsData, loading: dLoading } = useFetch('/diets?is_template=true');

  const workoutTemplates = workoutsData?.workout_plans || [];
  const dietTemplates = dietsData?.diet_plans || [];

  return (
    <div className="d-flex flex-column gap-4">
      <div>
        <h3 className="text-white font-weight-bold mb-1">Master Workout & Diet Templates</h3>
        <p className="text-muted mb-0">System-wide reusable master templates for instant assignment to members.</p>
      </div>

      <div className="row g-4">
        {/* Workout Master Templates */}
        <div className="col-12 col-lg-6">
          <div className="glass-card-static p-4 h-100">
            <div className="d-flex align-items-center gap-2 mb-3">
              <FiActivity className="text-cyan" size={24} />
              <h4 className="text-white font-weight-bold mb-0">Master Workout Plans</h4>
            </div>

            {wLoading ? (
              <SkeletonLoader count={2} height="100px" />
            ) : workoutTemplates.length === 0 ? (
              <p className="text-muted">No workout templates created yet.</p>
            ) : (
              <div className="d-flex flex-column gap-3">
                {workoutTemplates.map((w) => (
                  <div key={w.id} className="glass-card p-3 rounded-3">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <h5 className="text-white font-weight-bold mb-0">{w.title}</h5>
                      <span className="badge badge-active">{w.exercises?.length || 0} Exercises</span>
                    </div>
                    <p className="text-muted small mb-2">{w.description}</p>
                    <small className="text-cyan fw-semibold">
                      Creator: {w.creator_name || 'System Admin'}
                    </small>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Diet Master Templates */}
        <div className="col-12 col-lg-6">
          <div className="glass-card-static p-4 h-100">
            <div className="d-flex align-items-center gap-2 mb-3">
              <FiPieChart className="text-success" size={24} />
              <h4 className="text-white font-weight-bold mb-0">Master Diet Plans</h4>
            </div>

            {dLoading ? (
              <SkeletonLoader count={2} height="100px" />
            ) : dietTemplates.length === 0 ? (
              <p className="text-muted">No diet templates created yet.</p>
            ) : (
              <div className="d-flex flex-column gap-3">
                {dietTemplates.map((d) => (
                  <div key={d.id} className="glass-card p-3 rounded-3">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <h5 className="text-white font-weight-bold mb-0">{d.title}</h5>
                      <span className="badge badge-status badge-active">{d.daily_calorie_target} kcal/day</span>
                    </div>
                    <p className="text-muted small mb-2">{d.description}</p>
                    <div className="d-flex gap-3 text-muted small fw-semibold">
                      <span>P: {d.protein_target_g}g</span>
                      <span>C: {d.carbs_target_g}g</span>
                      <span>F: {d.fat_target_g}g</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
