import React, { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { useNotification } from '../../context/NotificationContext';
import api from '../../services/api';
import { SkeletonLoader } from '../../components/SkeletonLoader';
import { Modal } from '../../components/Modal';
import { FiSearch, FiDownload, FiUserPlus, FiCreditCard, FiFilter } from 'react-icons/fi';

export const ManageMembers = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const { data: membersData, loading, refetch } = useFetch(`/admin/members?search=${search}&status=${statusFilter}`);
  const { data: trainersData } = useFetch('/admin/trainers');
  const { data: plansData } = useFetch('/plans');
  const { addToast } = useNotification();

  // Modals state
  const [selectedMember, setSelectedMember] = useState(null);
  const [assignTrainerModal, setAssignTrainerModal] = useState(false);
  const [selectedTrainerId, setSelectedTrainerId] = useState('');

  const [assignSubModal, setAssignSubModal] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

  const handleExportCSV = async () => {
    try {
      const res = await api.get('/admin/export-csv', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'gymkhana_members_report.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      addToast('CSV Member Report exported successfully!', 'success');
    } catch (err) {
      addToast('Failed to export CSV', 'danger');
    }
  };

  const handleAssignTrainerSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/admin/members/${selectedMember.id}/assign-trainer`, {
        trainer_id: selectedTrainerId ? parseInt(selectedTrainerId) : null
      });
      addToast('Trainer updated successfully!', 'success');
      setAssignTrainerModal(false);
      refetch();
    } catch (err) {
      addToast(err.response?.data?.message || 'Error updating trainer', 'danger');
    }
  };

  const handleAssignSubSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/admin/members/${selectedMember.id}/subscription`, {
        plan_id: parseInt(selectedPlanId),
        start_date: startDate,
        payment_status: 'PAID'
      });
      addToast('Subscription assigned successfully!', 'success');
      setAssignSubModal(false);
      refetch();
    } catch (err) {
      addToast(err.response?.data?.message || 'Error assigning subscription', 'danger');
    }
  };

  const members = membersData?.members || [];

  return (
    <div className="d-flex flex-column gap-4">
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3">
        <div>
          <h3 className="text-white font-weight-bold mb-1">Member Directory & Subscriptions</h3>
          <p className="text-muted mb-0">Manage profiles, trainer assignments, and plan status.</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="btn btn-cyan-gradient d-flex align-items-center gap-2"
        >
          <FiDownload size={18} />
          <span>Export CSV Report</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="glass-card-static p-3 d-flex flex-column flex-md-row gap-3">
        <div className="position-relative flex-grow-1">
          <FiSearch className="position-absolute top-50 translate-middle-y ms-3 text-muted" size={18} />
          <input
            type="text"
            className="form-control glass-input ps-5"
            placeholder="Search member by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="d-flex align-items-center gap-2 w-100 w-md-auto">
          <FiFilter className="text-muted flex-shrink-0" size={18} />
          <select
            className="form-select glass-input flex-grow-1"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ minWidth: '160px' }}
          >
            <option value="" style={{ background: '#0F172A' }}>All Statuses</option>
            <option value="ACTIVE" style={{ background: '#0F172A' }}>Active</option>
            <option value="EXPIRING_SOON" style={{ background: '#0F172A' }}>Expiring Soon</option>
            <option value="EXPIRED" style={{ background: '#0F172A' }}>Expired</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <SkeletonLoader count={4} height="80px" />
      ) : (
        <div className="table-responsive">
          <table className="table-glass">
            <thead>
              <tr>
                <th>Member</th>
                <th>Assigned Trainer</th>
                <th>Subscription Plan</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-muted">
                    No members matching search query.
                  </td>
                </tr>
              ) : (
                members.map((m) => (
                  <tr key={m.id}>
                    <td>
                      <div>
                        <span className="d-block text-white fw-bold">{m.full_name}</span>
                        <small className="text-muted">{m.email} • {m.phone || 'No Phone'}</small>
                      </div>
                    </td>
                    <td>
                      <span className="text-white">
                        {m.trainer_name ? `🏋️ ${m.trainer_name}` : <em className="text-muted">Unassigned</em>}
                      </span>
                    </td>
                    <td>
                      <span className="fw-semibold text-cyan">{m.plan_title}</span>
                    </td>
                    <td>
                      {m.subscription_status === 'ACTIVE' && (
                        <span className="badge badge-status badge-active">Active</span>
                      )}
                      {m.subscription_status === 'EXPIRING_SOON' && (
                        <span className="badge badge-status badge-expiring">Expiring Soon</span>
                      )}
                      {(m.subscription_status === 'EXPIRED' || m.subscription_status === 'NO_PLAN') && (
                        <span className="badge badge-status badge-expired">Expired / No Plan</span>
                      )}
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedMember(m);
                            setSelectedTrainerId(m.trainer_id || '');
                            setAssignTrainerModal(true);
                          }}
                          className="btn btn-secondary-glass btn-sm d-flex align-items-center gap-1"
                        >
                          <FiUserPlus size={14} />
                          <span>Trainer</span>
                        </button>
                        <button
                          onClick={() => {
                            setSelectedMember(m);
                            setAssignSubModal(true);
                          }}
                          className="btn btn-primary-gradient btn-sm d-flex align-items-center gap-1"
                        >
                          <FiCreditCard size={14} />
                          <span>Assign Plan</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal: Assign Trainer */}
      <Modal
        isOpen={assignTrainerModal}
        onClose={() => setAssignTrainerModal(false)}
        title={`Assign Trainer to ${selectedMember?.full_name}`}
      >
        <form onSubmit={handleAssignTrainerSubmit} className="d-flex flex-column gap-3">
          <div>
            <label className="form-label text-muted small fw-semibold">Select Fitness Coach</label>
            <select
              className="form-select glass-input"
              value={selectedTrainerId}
              onChange={(e) => setSelectedTrainerId(e.target.value)}
            >
              <option value="" style={{ background: '#0F172A' }}>-- None (Unassigned) --</option>
              {(trainersData?.trainers || []).map((t) => (
                <option key={t.id} value={t.id} style={{ background: '#0F172A' }}>
                  {t.full_name} ({t.specialization} • {t.experience_years} yrs exp)
                </option>
              ))}
            </select>
          </div>

          <div className="d-flex justify-content-end gap-2 mt-3">
            <button
              type="button"
              className="btn btn-secondary-glass"
              onClick={() => setAssignTrainerModal(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary-gradient">
              Save Assignment
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Assign Subscription */}
      <Modal
        isOpen={assignSubModal}
        onClose={() => setAssignSubModal(false)}
        title={`Assign Subscription to ${selectedMember?.full_name}`}
      >
        <form onSubmit={handleAssignSubSubmit} className="d-flex flex-column gap-3">
          <div>
            <label className="form-label text-muted small fw-semibold">Select Plan</label>
            <select
              className="form-select glass-input"
              value={selectedPlanId}
              onChange={(e) => setSelectedPlanId(e.target.value)}
              required
            >
              <option value="" style={{ background: '#0F172A' }}>-- Choose Subscription Plan --</option>
              {(plansData?.plans || []).map((p) => (
                <option key={p.id} value={p.id} style={{ background: '#0F172A' }}>
                  {p.title} (${p.price} for {p.duration_months} month(s))
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label text-muted small fw-semibold">Start Date</label>
            <input
              type="date"
              className="form-control glass-input"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>

          <div className="d-flex justify-content-end gap-2 mt-3">
            <button
              type="button"
              className="btn btn-secondary-glass"
              onClick={() => setAssignSubModal(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-cyan-gradient">
              Activate Subscription
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
