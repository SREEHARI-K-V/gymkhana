import React, { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { useNotification } from '../../context/NotificationContext';
import api from '../../services/api';
import { FiActivity, FiPlus, FiTrash2, FiCopy } from 'react-icons/fi';

export const WorkoutPlanBuilder = () => {
  const { data: membersData } = useFetch('/trainer/members');
  const { data: templatesData } = useFetch('/workouts?is_template=true');
  const { addToast } = useNotification();

  const [isTemplate, setIsTemplate] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  // Template quick duplication state
  const [selectedTemplateId, setSelectedTemplateId] = useState('');

  const [exercises, setExercises] = useState([
    { day_of_week: 'MONDAY', exercise_name: 'Barbell Bench Press', target_muscle: 'Chest', sets: 4, reps: '8-10', rest_seconds: 90, notes: '' },
    { day_of_week: 'MONDAY', exercise_name: 'Incline Dumbbell Press', target_muscle: 'Chest', sets: 3, reps: '10-12', rest_seconds: 60, notes: '' }
  ]);

  const handleAddExerciseRow = () => {
    setExercises([
      ...exercises,
      { day_of_week: 'MONDAY', exercise_name: '', target_muscle: 'General', sets: 3, reps: '10-12', rest_seconds: 60, notes: '' }
    ]);
  };

  const handleRemoveExerciseRow = (idx) => {
    setExercises(exercises.filter((_, i) => i !== idx));
  };

  const handleExerciseChange = (idx, field, value) => {
    const updated = [...exercises];
    updated[idx][field] = value;
    setExercises(updated);
  };

  const handleSaveWorkout = async (e) => {
    e.preventDefault();
    if (!title) {
      addToast('Workout title is required', 'danger');
      return;
    }
    if (!isTemplate && !selectedMemberId) {
      addToast('Please select a member to assign this workout plan', 'danger');
      return;
    }

    try {
      await api.post('/workouts', {
        title,
        description,
        is_template: isTemplate,
        member_id: isTemplate ? null : parseInt(selectedMemberId),
        exercises
      });
      addToast('Workout plan created & saved successfully!', 'success');
      setTitle('');
      setDescription('');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save workout plan', 'danger');
    }
  };

  const handleDuplicateTemplate = async () => {
    if (!selectedTemplateId || !selectedMemberId) {
      addToast('Please select both a template and a member to duplicate', 'danger');
      return;
    }
    try {
      await api.post('/workouts/duplicate-template', {
        template_id: parseInt(selectedTemplateId),
        member_id: parseInt(selectedMemberId)
      });
      addToast('Template workout duplicated and assigned to member!', 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to duplicate template', 'danger');
    }
  };

  const members = membersData?.members || [];
  const templates = templatesData?.workout_plans || [];

  return (
    <div className="d-flex flex-column gap-4">
      {/* Header */}
      <div>
        <h3 className="text-white font-weight-bold mb-1">Workout Routine Planner</h3>
        <p className="text-muted mb-0">Build structured exercise routines by day of week, sets, reps, and muscle groups.</p>
      </div>

      {/* Quick Template Duplication Box */}
      <div className="glass-card-static p-4">
        <h5 className="text-cyan font-weight-bold mb-3 d-flex align-items-center gap-2">
          <FiCopy /> Quick Duplicate Master Template to Member
        </h5>
        <div className="row g-3">
          <div className="col-md-5">
            <select
              className="form-select glass-input"
              value={selectedTemplateId}
              onChange={(e) => setSelectedTemplateId(e.target.value)}
            >
              <option value="" style={{ background: '#0F172A' }}>-- Choose Master Template --</option>
              {templates.map((t) => (
                <option key={t.id} value={t.id} style={{ background: '#0F172A' }}>
                  {t.title} ({t.exercises?.length || 0} Exercises)
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-5">
            <select
              className="form-select glass-input"
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
            >
              <option value="" style={{ background: '#0F172A' }}>-- Choose Target Member --</option>
              {members.map((m) => (
                <option key={m.id} value={m.id} style={{ background: '#0F172A' }}>
                  {m.full_name} ({m.plan_title})
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <button
              type="button"
              className="btn btn-cyan-gradient w-100"
              onClick={handleDuplicateTemplate}
            >
              Duplicate
            </button>
          </div>
        </div>
      </div>

      {/* Main Builder Form */}
      <form onSubmit={handleSaveWorkout} className="glass-card-static p-4 d-flex flex-column gap-4">
        <h5 className="text-white font-weight-bold mb-0">Create Custom Workout Plan</h5>

        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label text-muted small fw-semibold">Plan Title</label>
            <input
              type="text"
              className="form-control glass-input"
              placeholder="e.g. 4-Day Strength & Conditioning"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="col-md-3">
            <label className="form-label text-muted small fw-semibold">Type</label>
            <select
              className="form-select glass-input"
              value={isTemplate ? 'true' : 'false'}
              onChange={(e) => setIsTemplate(e.target.value === 'true')}
            >
              <option value="false" style={{ background: '#0F172A' }}>Assign to Specific Member</option>
              <option value="true" style={{ background: '#0F172A' }}>Save as Master Template</option>
            </select>
          </div>

          {!isTemplate && (
            <div className="col-md-3">
              <label className="form-label text-muted small fw-semibold">Assigned Member</label>
              <select
                className="form-select glass-input"
                value={selectedMemberId}
                onChange={(e) => setSelectedMemberId(e.target.value)}
                required
              >
                <option value="" style={{ background: '#0F172A' }}>-- Select Member --</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id} style={{ background: '#0F172A' }}>
                    {m.full_name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="col-12">
            <label className="form-label text-muted small fw-semibold">Routine Description & Instructions</label>
            <textarea
              className="form-control glass-input"
              rows="2"
              placeholder="Provide warmup instructions or target intensity..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        {/* Exercises List Builder */}
        <div className="d-flex align-items-center justify-content-between pt-3 border-top border-secondary border-opacity-25">
          <h6 className="text-white font-weight-bold mb-0">Exercises Sequence</h6>
          <button
            type="button"
            className="btn btn-secondary-glass btn-sm d-flex align-items-center gap-1"
            onClick={handleAddExerciseRow}
          >
            <FiPlus size={14} />
            <span>Add Exercise Row</span>
          </button>
        </div>

        <div className="d-flex flex-column gap-3">
          {exercises.map((ex, idx) => (
            <div key={idx} className="p-3 glass-card rounded-3 row g-2 align-items-center">
              <div className="col-md-2">
                <label className="text-muted small">Day</label>
                <select
                  className="form-select glass-input"
                  value={ex.day_of_week}
                  onChange={(e) => handleExerciseChange(idx, 'day_of_week', e.target.value)}
                >
                  <option value="MONDAY" style={{ background: '#0F172A' }}>Monday</option>
                  <option value="TUESDAY" style={{ background: '#0F172A' }}>Tuesday</option>
                  <option value="WEDNESDAY" style={{ background: '#0F172A' }}>Wednesday</option>
                  <option value="THURSDAY" style={{ background: '#0F172A' }}>Thursday</option>
                  <option value="FRIDAY" style={{ background: '#0F172A' }}>Friday</option>
                  <option value="SATURDAY" style={{ background: '#0F172A' }}>Saturday</option>
                  <option value="SUNDAY" style={{ background: '#0F172A' }}>Sunday</option>
                </select>
              </div>

              <div className="col-md-3">
                <label className="text-muted small">Exercise Name</label>
                <input
                  type="text"
                  className="form-control glass-input"
                  placeholder="e.g. Barbell Squat"
                  value={ex.exercise_name}
                  onChange={(e) => handleExerciseChange(idx, 'exercise_name', e.target.value)}
                  required
                />
              </div>

              <div className="col-md-2">
                <label className="text-muted small">Target Muscle</label>
                <input
                  type="text"
                  className="form-control glass-input"
                  placeholder="e.g. Legs"
                  value={ex.target_muscle}
                  onChange={(e) => handleExerciseChange(idx, 'target_muscle', e.target.value)}
                />
              </div>

              <div className="col-md-1">
                <label className="text-muted small">Sets</label>
                <input
                  type="number"
                  className="form-control glass-input"
                  value={ex.sets}
                  onChange={(e) => handleExerciseChange(idx, 'sets', parseInt(e.target.value))}
                />
              </div>

              <div className="col-md-2">
                <label className="text-muted small">Reps</label>
                <input
                  type="text"
                  className="form-control glass-input"
                  placeholder="10-12"
                  value={ex.reps}
                  onChange={(e) => handleExerciseChange(idx, 'reps', e.target.value)}
                />
              </div>

              <div className="col-md-1 text-end pt-3">
                <button
                  type="button"
                  className="btn btn-link text-danger p-0"
                  onClick={() => handleRemoveExerciseRow(idx)}
                >
                  <FiTrash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="d-flex justify-content-end gap-2 mt-3">
          <button type="submit" className="btn btn-primary-gradient px-4">
            Save Workout Plan
          </button>
        </div>
      </form>
    </div>
  );
};
