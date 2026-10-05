import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { useNotification } from '../../context/NotificationContext';
import api from '../../services/api';
import { SkeletonLoader } from '../../components/SkeletonLoader';
import { 
  FiBell, FiCheckCircle, FiClock, FiActivity, FiCreditCard, 
  FiCalendar, FiPieChart, FiInfo, FiCheck, FiArrowRight
} from 'react-icons/fi';

export const MemberNotifications = () => {
  const { data, loading, error, refetch } = useFetch('/member/notifications');
  const { addToast } = useNotification();
  const navigate = useNavigate();

  const [activeFilter, setActiveFilter] = useState('ALL');

  if (loading) return <SkeletonLoader count={4} height="90px" />;
  if (error) return <div className="alert alert-danger">{error}</div>;

  const notifications = data?.notifications || [];
  const unreadCount = data?.unread_count || 0;

  const handleMarkAsRead = async (id = null) => {
    try {
      await api.put('/member/notifications', id ? { id } : {});
      addToast(id ? 'Notification marked as read' : 'All notifications marked as read', 'success');
      refetch();
    } catch (err) {
      addToast('Error updating notification', 'danger');
    }
  };

  const filteredNotifs = notifications.filter((n) => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'UNREAD') return !n.is_read;
    return n.category === activeFilter;
  });

  const getIconForType = (type) => {
    switch (type) {
      case 'WORKOUT':
        return <FiActivity className="text-primary" size={20} />;
      case 'RENEWAL':
        return <FiCreditCard className="text-warning" size={20} />;
      case 'SLOT':
        return <FiCalendar className="text-success" size={20} />;
      case 'DIET':
        return <FiPieChart className="text-cyan" size={20} />;
      default:
        return <FiInfo className="text-info" size={20} />;
    }
  };

  return (
    <div className="d-flex flex-column gap-4">
      {/* Header Banner */}
      <div className="glass-card p-4 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
        <div className="d-flex align-items-center gap-3">
          <div className="p-3 bg-dark rounded-circle text-cyan border border-primary border-opacity-30 position-relative">
            <FiBell size={24} />
            {unreadCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <span className="badge badge-active mb-1">Alerts & Updates</span>
            <h3 className="text-white font-weight-bold mb-0">Notifications</h3>
            <p className="text-muted mb-0 small">Stay informed with updates regarding workouts, nutrition, renewals, and booked slots.</p>
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={() => handleMarkAsRead(null)}
            className="btn btn-secondary-glass d-flex align-items-center gap-2 align-self-start align-self-md-center"
          >
            <FiCheck size={16} />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="glass-card-static p-2 rounded-3 d-flex flex-wrap gap-1">
        {[
          { key: 'ALL', label: `All (${notifications.length})` },
          { key: 'UNREAD', label: `Unread (${unreadCount})` },
          { key: 'TRAINING', label: 'Workout Updates' },
          { key: 'BILLING', label: 'Billing & Renewal' },
          { key: 'GYM', label: 'Passes & Slots' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveFilter(tab.key)}
            className={`btn btn-sm px-3 py-2 rounded-2 ${
              activeFilter === tab.key ? 'btn-primary-gradient' : 'btn-secondary-glass text-muted'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="glass-card-static p-4">
        <div className="d-flex flex-column gap-3">
          {filteredNotifs.length === 0 ? (
            <div className="p-5 text-center text-muted">
              <FiBell size={36} className="text-muted mb-2 d-block mx-auto opacity-50" />
              <h6 className="text-white">No notifications in this view</h6>
              <p className="small mb-0">You're completely up to date with your gym schedules!</p>
            </div>
          ) : (
            filteredNotifs.map((notif) => (
              <div
                key={notif.id}
                className={`p-3 p-sm-4 rounded-3 glass-card d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 transition-all ${
                  !notif.is_read ? 'border-primary border-opacity-50 bg-primary bg-opacity-10' : 'border-secondary border-opacity-25'
                }`}
              >
                <div className="d-flex align-items-start gap-3">
                  <div className="p-2 bg-dark rounded-3 flex-shrink-0 mt-1">
                    {getIconForType(notif.type)}
                  </div>
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <h6 className="text-white font-weight-bold mb-0">{notif.title}</h6>
                      {!notif.is_read && (
                        <span className="badge bg-danger" style={{ fontSize: '0.62rem' }}>NEW</span>
                      )}
                    </div>
                    <p className="text-muted small mb-1">{notif.message}</p>
                    <small className="text-muted" style={{ fontSize: '0.72rem' }}>
                      <FiClock className="me-1" size={11} /> {notif.created_at}
                    </small>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-2 flex-shrink-0 align-self-end align-self-sm-center">
                  {notif.action_link && (
                    <button
                      onClick={() => navigate(notif.action_link)}
                      className="btn btn-secondary-glass btn-sm d-flex align-items-center gap-1"
                      style={{ fontSize: '0.78rem' }}
                    >
                      <span>{notif.action_label || 'View'}</span>
                      <FiArrowRight size={13} />
                    </button>
                  )}
                  {!notif.is_read && (
                    <button
                      onClick={() => handleMarkAsRead(notif.id)}
                      className="btn btn-primary-gradient btn-sm"
                      title="Mark as Read"
                      style={{ fontSize: '0.78rem' }}
                    >
                      <FiCheck size={13} />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
