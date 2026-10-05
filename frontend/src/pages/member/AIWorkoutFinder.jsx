import React, { useState } from 'react';
import { useNotification } from '../../context/NotificationContext';
import api from '../../services/api';
import { 
  FiZap, FiActivity, FiClock, FiTarget, 
  FiRepeat, FiCheckCircle, FiShield, FiCpu, FiTrendingUp, 
  FiRefreshCw, FiBookmark, FiSliders
} from 'react-icons/fi';

export const AIWorkoutFinder = () => {
  const { addToast } = useNotification();

  const [params, setParams] = useState({
    goal: 'MUSCLE_GAIN',
    level: 'INTERMEDIATE',
    equipment: 'FULL_GYM',
    muscle_focus: 'FULL_BODY',
    duration: 45,
    intensity: 'HIGH'
  });

  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [savedRoutines, setSavedRoutines] = useState([]);

  // Curated AI Template Presets
  const presets = [
    {
      label: '30-Min High-Calorie HIIT Torcher',
      icon: '🔥',
      params: { goal: 'FAT_LOSS', level: 'INTERMEDIATE', equipment: 'FULL_GYM', muscle_focus: 'CORE_CARDIO', duration: 30, intensity: 'EXTREME' }
    },
    {
      label: 'Push Day Hypertrophy Protocol',
      icon: '🏋️',
      params: { goal: 'MUSCLE_GAIN', level: 'ADVANCED', equipment: 'FULL_GYM', muscle_focus: 'PUSH', duration: 60, intensity: 'HIGH' }
    },
    {
      label: 'Home Dumbbell Full Body Builder',
      icon: '⚡',
      params: { goal: 'MUSCLE_GAIN', level: 'BEGINNER', equipment: 'DUMBBELLS', muscle_focus: 'FULL_BODY', duration: 45, intensity: 'MODERATE' }
    },
    {
      label: 'Glute & Leg Power Matrix',
      icon: '🦵',
      params: { goal: 'STRENGTH', level: 'INTERMEDIATE', equipment: 'FULL_GYM', muscle_focus: 'LEGS', duration: 60, intensity: 'HIGH' }
    }
  ];

  const handleGenerate = async (customParams = null) => {
    const activeParams = customParams || params;
    setLoading(true);
    setRecommendation(null);

    try {
      const res = await api.post('/member/ai-workout-finder', activeParams);
      if (res.data.success) {
        setRecommendation(res.data.ai_recommendation);
        addToast('AI Workout Protocol successfully compiled!', 'success');
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Error generating AI workout', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPreset = (preset) => {
    setParams(preset.params);
    handleGenerate(preset.params);
  };

  const handleSaveRoutine = () => {
    if (!recommendation) return;
    setSavedRoutines(prev => [recommendation, ...prev]);
    addToast('Workout Routine saved to your personal library!', 'success');
  };

  return (
    <div className="d-flex flex-column gap-4">
      {/* Header Banner */}
      <div 
        className="glass-card p-4 position-relative overflow-hidden border border-primary border-opacity-30"
        style={{
          background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)'
        }}
      >
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
          <div>
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="badge bg-primary text-white d-flex align-items-center gap-1">
                <FiCpu size={12} /> GYMKHANA AI ENGINE v2.4
              </span>
              <span className="badge badge-active">Dynamic Biomechanics</span>
            </div>
            <h3 className="text-white font-weight-bold mb-1">AI Workout Finder</h3>
            <p className="text-muted mb-0">
              Generate custom, scientific training routines tailored to your equipment, available time, target muscle groups, and intensity.
            </p>
          </div>

          <button
            onClick={() => handleGenerate()}
            disabled={loading}
            className="btn btn-primary-gradient d-flex align-items-center gap-2 align-self-start align-self-md-center flex-shrink-0"
          >
            <FiZap size={18} />
            <span>{loading ? 'AI Analyzing...' : 'Generate AI Workout'}</span>
          </button>
        </div>
      </div>

      {/* Quick AI Presets Shelf */}
      <div>
        <small className="text-muted text-uppercase fw-semibold d-block mb-2" style={{ fontSize: '0.75rem' }}>
          Instant AI Presets:
        </small>
        <div className="row g-2">
          {presets.map((p, idx) => (
            <div key={idx} className="col-12 col-sm-6 col-lg-3">
              <button
                type="button"
                onClick={() => handleSelectPreset(p)}
                className="btn btn-secondary-glass w-100 p-3 text-start d-flex align-items-center gap-2 hover-lift"
              >
                <span className="fs-4">{p.icon}</span>
                <div className="text-truncate">
                  <span className="text-white fw-bold d-block text-truncate small">{p.label}</span>
                  <small className="text-cyan">{p.params.duration} mins • {p.params.intensity}</small>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Workout Parameters Form */}
      <div className="glass-card-static p-4">
        <h5 className="text-white font-weight-bold mb-3 d-flex align-items-center gap-2">
          <FiSliders className="text-cyan" /> Configure Your Routine Parameters
        </h5>

        <div className="row g-3">
          {/* Goal */}
          <div className="col-12 col-sm-6 col-lg-4">
            <label className="form-label text-muted small fw-semibold">🎯 Primary Fitness Goal</label>
            <select
              className="form-select bg-dark text-white border-secondary"
              value={params.goal}
              onChange={(e) => setParams(prev => ({ ...prev, goal: e.target.value }))}
            >
              <option value="MUSCLE_GAIN">Muscle Building & Hypertrophy</option>
              <option value="FAT_LOSS">Rapid Fat Loss & Calorie Burn</option>
              <option value="STRENGTH">Max Power & Strength</option>
              <option value="ENDURANCE">Athletic Conditioning & Endurance</option>
              <option value="CALISTHENICS">Calisthenics & Bodyweight Agility</option>
            </select>
          </div>

          {/* Experience Level */}
          <div className="col-12 col-sm-6 col-lg-4">
            <label className="form-label text-muted small fw-semibold">📊 Experience Level</label>
            <select
              className="form-select bg-dark text-white border-secondary"
              value={params.level}
              onChange={(e) => setParams(prev => ({ ...prev, level: e.target.value }))}
            >
              <option value="BEGINNER">Beginner (&lt; 1 year lifting)</option>
              <option value="INTERMEDIATE">Intermediate (1-3 years)</option>
              <option value="ADVANCED">Advanced / Competitive</option>
            </select>
          </div>

          {/* Equipment Available */}
          <div className="col-12 col-sm-6 col-lg-4">
            <label className="form-label text-muted small fw-semibold">🏋️ Equipment Available</label>
            <select
              className="form-select bg-dark text-white border-secondary"
              value={params.equipment}
              onChange={(e) => setParams(prev => ({ ...prev, equipment: e.target.value }))}
            >
              <option value="FULL_GYM">Full Commercial Gym (Barbells, Cables, Machines)</option>
              <option value="DUMBBELLS">Dumbbells & Adjustable Bench Only</option>
              <option value="BODYWEIGHT">Bodyweight / Calisthenics Only</option>
              <option value="RESISTANCE_BANDS">Home Bands & Mat</option>
            </select>
          </div>

          {/* Muscle Focus */}
          <div className="col-12 col-sm-6 col-lg-4">
            <label className="form-label text-muted small fw-semibold">🎯 Muscle Focus Split</label>
            <select
              className="form-select bg-dark text-white border-secondary"
              value={params.muscle_focus}
              onChange={(e) => setParams(prev => ({ ...prev, muscle_focus: e.target.value }))}
            >
              <option value="FULL_BODY">Full Body Total Engagement</option>
              <option value="PUSH">Push (Chest, Shoulders & Triceps)</option>
              <option value="PULL">Pull (Back, Rear Delts & Biceps)</option>
              <option value="LEGS">Legs, Quads & Hamstrings</option>
              <option value="CORE_CARDIO">Core, Abs & Metabolic Sprints</option>
            </select>
          </div>

          {/* Duration */}
          <div className="col-12 col-sm-6 col-lg-4">
            <label className="form-label text-muted small fw-semibold">⏱️ Session Duration</label>
            <select
              className="form-select bg-dark text-white border-secondary"
              value={params.duration}
              onChange={(e) => setParams(prev => ({ ...prev, duration: Number(e.target.value) }))}
            >
              <option value="30">30 Minutes (Express HIIT / Circuit)</option>
              <option value="45">45 Minutes (Optimal Hypertrophy)</option>
              <option value="60">60 Minutes (Standard Complete Session)</option>
              <option value="75">75 Minutes (High Volume Power Split)</option>
            </select>
          </div>

          {/* Intensity */}
          <div className="col-12 col-sm-6 col-lg-4">
            <label className="form-label text-muted small fw-semibold">⚡ Workout Intensity</label>
            <select
              className="form-select bg-dark text-white border-secondary"
              value={params.intensity}
              onChange={(e) => setParams(prev => ({ ...prev, intensity: e.target.value }))}
            >
              <option value="MODERATE">Moderate (Form Focus & Sustained RPE 7)</option>
              <option value="HIGH">High Intensity (RPE 8-9 Progressive Overload)</option>
              <option value="EXTREME">Beast Mode (Supersets & Max Burn RPE 10)</option>
            </select>
          </div>
        </div>

        <div className="mt-4 pt-3 border-top border-secondary border-opacity-25 d-flex justify-content-end">
          <button
            onClick={() => handleGenerate()}
            disabled={loading}
            className="btn btn-primary-gradient px-4 d-flex align-items-center gap-2"
          >
            <FiZap size={18} />
            <span>{loading ? 'Synthesizing with AI...' : 'Find & Build AI Workout'}</span>
          </button>
        </div>
      </div>

      {/* AI Loading State */}
      {loading && (
        <div className="glass-card p-5 text-center my-3 border border-primary border-opacity-50">
          <div className="spinner-border text-cyan mb-3" style={{ width: '3rem', height: '3rem' }} role="status" />
          <h4 className="text-white font-weight-bold mb-1">Synthesizing Biomechanics Routine...</h4>
          <p className="text-muted small mb-0">Analyzing muscle fiber recruitment, optimal rest intervals, and equipment constraints.</p>
        </div>
      )}

      {/* AI Recommendation Result */}
      {recommendation && (
        <div className="d-flex flex-column gap-4 animate-fade-in">
          {/* Overview Banner */}
          <div className="glass-card-static p-4 border border-success border-opacity-40">
            <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-3">
              <div>
                <span className="badge badge-active mb-2">AI COMPILED WORKOUT ROUTINE</span>
                <h3 className="text-white font-weight-bold mb-1">{recommendation.title}</h3>
                <p className="text-muted mb-0">{recommendation.strategy}</p>
              </div>
              <div className="d-flex gap-2">
                <button
                  onClick={handleSaveRoutine}
                  className="btn btn-secondary-glass btn-sm d-flex align-items-center gap-1"
                >
                  <FiBookmark size={14} />
                  <span>Save Routine</span>
                </button>
                <button
                  onClick={() => handleGenerate()}
                  className="btn btn-primary-gradient btn-sm d-flex align-items-center gap-1"
                >
                  <FiRefreshCw size={14} />
                  <span>Regenerate</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="row g-2 pt-2 border-top border-secondary border-opacity-25">
              <div className="col-6 col-md-3">
                <div className="glass-card p-2 text-center rounded-2">
                  <small className="text-muted d-block" style={{ fontSize: '0.72rem' }}>Duration</small>
                  <strong className="text-cyan">{recommendation.duration_minutes} Mins</strong>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="glass-card p-2 text-center rounded-2">
                  <small className="text-muted d-block" style={{ fontSize: '0.72rem' }}>Est. Calorie Burn</small>
                  <strong className="text-warning d-flex align-items-center justify-content-center gap-1">
                    <FiZap size={14} /> {recommendation.est_calories} kcal
                  </strong>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="glass-card p-2 text-center rounded-2">
                  <small className="text-muted d-block" style={{ fontSize: '0.72rem' }}>Intensity</small>
                  <strong className="text-white">{recommendation.intensity}</strong>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="glass-card p-2 text-center rounded-2">
                  <small className="text-muted d-block" style={{ fontSize: '0.72rem' }}>Heart Rate Zone</small>
                  <strong className="text-success">{recommendation.target_heart_rate}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Warmup Protocol */}
          {recommendation.warmup && (
            <div className="glass-card-static p-4">
              <h5 className="text-white font-weight-bold mb-3 d-flex align-items-center gap-2">
                <FiActivity className="text-primary" /> Dynamic Warm-Up Protocol (5-7 Mins)
              </h5>
              <div className="row g-2">
                {recommendation.warmup.map((w, wIdx) => (
                  <div key={wIdx} className="col-12 col-md-4">
                    <div className="p-3 glass-card rounded-3 h-100">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="badge badge-role">{w.duration}</span>
                      </div>
                      <h6 className="text-white font-weight-bold mb-1">{w.name}</h6>
                      <small className="text-muted">{w.focus}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Main Exercise Routine */}
          <div className="glass-card-static p-4">
            <h5 className="text-white font-weight-bold mb-3 d-flex align-items-center gap-2">
              <FiZap className="text-cyan" /> Main Training Exercises ({recommendation.exercises.length})
            </h5>

            <div className="d-flex flex-column gap-3">
              {recommendation.exercises.map((ex, idx) => (
                <div key={idx} className="glass-card p-3 p-sm-4 rounded-3 border border-secondary border-opacity-25">
                  <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2 mb-2">
                    <div>
                      <span className="badge badge-role me-2">Exercise {idx + 1}</span>
                      <h5 className="text-white font-weight-bold d-inline mb-0">{ex.name}</h5>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <span className="badge bg-primary bg-opacity-25 text-cyan border border-primary border-opacity-50">
                        {ex.sets} Sets × {ex.reps}
                      </span>
                      <span className="badge bg-dark text-muted">
                        <FiClock className="me-1" /> {ex.rest}s Rest
                      </span>
                      {ex.tempo && (
                        <span className="badge bg-dark text-muted">
                          Tempo: {ex.tempo}
                        </span>
                      )}
                    </div>
                  </div>

                  {ex.note && (
                    <div className="p-2 glass-card-static rounded-2 mt-2">
                      <small className="text-cyan fw-semibold d-block mb-1">💡 AI Coach Tactical Tip:</small>
                      <small className="text-muted">{ex.note}</small>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Cooldown Protocol & Coach Advice */}
          <div className="glass-card-static p-4">
            <div className="row g-4">
              <div className="col-12 col-md-6">
                <h6 className="text-white font-weight-bold mb-2">Recovery & Cooldown (3-5 Mins)</h6>
                <div className="d-flex flex-column gap-2">
                  {recommendation.cooldown.map((c, cIdx) => (
                    <div key={cIdx} className="p-2 glass-card rounded-2 d-flex justify-content-between text-muted small">
                      <span className="text-white">{c.name}</span>
                      <span className="text-cyan">{c.duration}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-12 col-md-6">
                <h6 className="text-white font-weight-bold mb-2">Coach Strategy Synthesis</h6>
                <div className="p-3 glass-card rounded-3 border border-primary border-opacity-25">
                  <p className="text-muted small mb-0">{recommendation.coach_tip}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
