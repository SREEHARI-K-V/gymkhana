import React, { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { useNotification } from '../../context/NotificationContext';
import api from '../../services/api';
import { FiPieChart, FiPlus, FiTrash2, FiCopy } from 'react-icons/fi';

export const DietPlanBuilder = () => {
  const { data: membersData } = useFetch('/trainer/members');
  const { data: templatesData } = useFetch('/diets?is_template=true');
  const { addToast } = useNotification();

  const [isTemplate, setIsTemplate] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const [dailyCalorieTarget, setDailyCalorieTarget] = useState(2200);
  const [proteinTarget, setProteinTarget] = useState(160);
  const [carbsTarget, setCarbsTarget] = useState(220);
  const [fatTarget, setFatTarget] = useState(60);

  const [selectedTemplateId, setSelectedTemplateId] = useState('');

  const [meals, setMeals] = useState([
    { day_of_week: 'MONDAY', meal_time: 'Breakfast', meal_name: 'Oatmeal with Whole Milk & Eggs', calories: 550, protein: 40, carbs: 65, fat: 14 },
    { day_of_week: 'MONDAY', meal_time: 'Lunch', meal_name: 'Grilled Chicken Breast & Rice', calories: 650, protein: 50, carbs: 75, fat: 12 }
  ]);

  const handleAddMealRow = () => {
    setMeals([
      ...meals,
      { day_of_week: 'MONDAY', meal_time: 'Snack', meal_name: '', calories: 300, protein: 20, carbs: 30, fat: 10 }
    ]);
  };

  const handleRemoveMealRow = (idx) => {
    setMeals(meals.filter((_, i) => i !== idx));
  };

  const handleMealChange = (idx, field, value) => {
    const updated = [...meals];
    updated[idx][field] = value;
    setMeals(updated);
  };

  const handleSaveDiet = async (e) => {
    e.preventDefault();
    if (!title) {
      addToast('Diet plan title is required', 'danger');
      return;
    }

    try {
      await api.post('/diets', {
        title,
        description,
        daily_calorie_target: dailyCalorieTarget,
        protein_target_g: proteinTarget,
        carbs_target_g: carbsTarget,
        fat_target_g: fatTarget,
        is_template: isTemplate,
        member_id: isTemplate ? null : parseInt(selectedMemberId),
        meals
      });
      addToast('Diet plan created & saved successfully!', 'success');
      setTitle('');
      setDescription('');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save diet plan', 'danger');
    }
  };

  const handleDuplicateTemplate = async () => {
    if (!selectedTemplateId || !selectedMemberId) {
      addToast('Please select both a template and a member to duplicate', 'danger');
      return;
    }
    try {
      await api.post('/diets/duplicate-template', {
        template_id: parseInt(selectedTemplateId),
        member_id: parseInt(selectedMemberId)
      });
      addToast('Template diet plan duplicated and assigned to member!', 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to duplicate template', 'danger');
    }
  };

  const members = membersData?.members || [];
  const templates = templatesData?.diet_plans || [];

  return (
    <div className="d-flex flex-column gap-4">
      <div>
        <h3 className="text-white font-weight-bold mb-1">Diet & Nutrition Builder</h3>
        <p className="text-muted mb-0">Design macronutrient targeted meal plans and daily food logs for members.</p>
      </div>

      {/* Quick Template Duplication */}
      <div className="glass-card-static p-4">
        <h5 className="text-cyan font-weight-bold mb-3 d-flex align-items-center gap-2">
          <FiCopy /> Quick Duplicate Master Diet Template to Member
        </h5>
        <div className="row g-3">
          <div className="col-md-5">
            <select
              className="form-select glass-input"
              value={selectedTemplateId}
              onChange={(e) => setSelectedTemplateId(e.target.value)}
            >
              <option value="" style={{ background: '#0F172A' }}>-- Choose Master Diet Template --</option>
              {templates.map((t) => (
                <option key={t.id} value={t.id} style={{ background: '#0F172A' }}>
                  {t.title} ({t.daily_calorie_target} kcal/day)
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
                  {m.full_name}
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
      <form onSubmit={handleSaveDiet} className="glass-card-static p-4 d-flex flex-column gap-4">
        <h5 className="text-white font-weight-bold mb-0">Create Custom Diet Plan</h5>

        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label text-muted small fw-semibold">Plan Title</label>
            <input
              type="text"
              className="form-control glass-input"
              placeholder="e.g. High Protein Clean Lean Bulk"
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

          {/* Macro Targets */}
          <div className="col-6 col-md-3">
            <label className="form-label text-muted small fw-semibold">Daily Calories (kcal)</label>
            <input
              type="number"
              className="form-control glass-input"
              value={dailyCalorieTarget}
              onChange={(e) => setDailyCalorieTarget(parseInt(e.target.value))}
            />
          </div>
          <div className="col-6 col-md-3">
            <label className="form-label text-muted small fw-semibold">Protein Target (g)</label>
            <input
              type="number"
              className="form-control glass-input"
              value={proteinTarget}
              onChange={(e) => setProteinTarget(parseInt(e.target.value))}
            />
          </div>
          <div className="col-6 col-md-3">
            <label className="form-label text-muted small fw-semibold">Carbs Target (g)</label>
            <input
              type="number"
              className="form-control glass-input"
              value={carbsTarget}
              onChange={(e) => setCarbsTarget(parseInt(e.target.value))}
            />
          </div>
          <div className="col-6 col-md-3">
            <label className="form-label text-muted small fw-semibold">Fat Target (g)</label>
            <input
              type="number"
              className="form-control glass-input"
              value={fatTarget}
              onChange={(e) => setFatTarget(parseInt(e.target.value))}
            />
          </div>
        </div>

        {/* Meal Items Builder */}
        <div className="d-flex align-items-center justify-content-between pt-3 border-top border-secondary border-opacity-25">
          <h6 className="text-white font-weight-bold mb-0">Daily Meal Items</h6>
          <button
            type="button"
            className="btn btn-secondary-glass btn-sm d-flex align-items-center gap-1"
            onClick={handleAddMealRow}
          >
            <FiPlus size={14} />
            <span>Add Meal Row</span>
          </button>
        </div>

        <div className="d-flex flex-column gap-3">
          {meals.map((m, idx) => (
            <div key={idx} className="p-3 glass-card rounded-3 row g-2 align-items-end position-relative">
              <div className="col-12 col-sm-6 col-lg-2">
                <label className="text-muted small">Day</label>
                <select
                  className="form-select glass-input"
                  value={m.day_of_week}
                  onChange={(e) => handleMealChange(idx, 'day_of_week', e.target.value)}
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

              <div className="col-12 col-sm-6 col-lg-2">
                <label className="text-muted small">Meal Time</label>
                <input
                  type="text"
                  className="form-control glass-input"
                  placeholder="Breakfast"
                  value={m.meal_time}
                  onChange={(e) => handleMealChange(idx, 'meal_time', e.target.value)}
                />
              </div>

              <div className="col-12 col-sm-12 col-lg-3">
                <label className="text-muted small">Meal Items / Food Description</label>
                <input
                  type="text"
                  className="form-control glass-input"
                  placeholder="4 Egg Whites & Oatmeal"
                  value={m.meal_name}
                  onChange={(e) => handleMealChange(idx, 'meal_name', e.target.value)}
                  required
                />
              </div>

              <div className="col-4 col-sm-3 col-lg-1">
                <label className="text-muted small">Calories</label>
                <input
                  type="number"
                  className="form-control glass-input"
                  value={m.calories}
                  onChange={(e) => handleMealChange(idx, 'calories', parseInt(e.target.value))}
                />
              </div>

              <div className="col-3 col-sm-3 col-lg-1">
                <label className="text-muted small">Prot (g)</label>
                <input
                  type="number"
                  className="form-control glass-input"
                  value={m.protein}
                  onChange={(e) => handleMealChange(idx, 'protein', parseInt(e.target.value))}
                />
              </div>

              <div className="col-3 col-sm-3 col-lg-1">
                <label className="text-muted small">Carb (g)</label>
                <input
                  type="number"
                  className="form-control glass-input"
                  value={m.carbs}
                  onChange={(e) => handleMealChange(idx, 'carbs', parseInt(e.target.value))}
                />
              </div>

              <div className="col-2 col-sm-3 col-lg-2 text-end">
                <button
                  type="button"
                  className="btn btn-link text-danger p-2 hover-white"
                  title="Remove meal"
                  aria-label="Remove meal"
                  onClick={() => handleRemoveMealRow(idx)}
                >
                  <FiTrash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="d-flex justify-content-end gap-2 mt-3">
          <button type="submit" className="btn btn-cyan-gradient px-4">
            Save Diet Plan
          </button>
        </div>
      </form>
    </div>
  );
};
