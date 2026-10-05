import React, { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { SkeletonLoader } from '../../components/SkeletonLoader';
import { useNotification } from '../../context/NotificationContext';
import { GymDetailsModal } from '../../components/GymDetailsModal';
import { 
  FiMapPin, FiClock, FiPhone, FiStar, FiCalendar, 
  FiCheckCircle, FiActivity, FiFilter, FiSearch, 
  FiUser, FiInfo, FiDollarSign, FiX, 
  FiGrid, FiNavigation, FiZap, FiCheck
} from 'react-icons/fi';

export const GymBranches = () => {
  const { data, loading, error, refetch } = useFetch('/member/branches');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('ALL');
  const [activeGymModal, setActiveGymModal] = useState(null);
  const [modalTab, setModalTab] = useState('OVERVIEW');
  const [viewPassBooking, setViewPassBooking] = useState(null);

  if (loading) return <SkeletonLoader count={3} height="160px" />;
  if (error) return <div className="alert alert-danger">{error}</div>;

  const branches = data?.branches || data?.gyms || [];
  const bookings = data?.bookings || [];

  const filteredBranches = branches.filter((gym) => {
    const matchesCity = selectedCity === 'ALL' || gym.city === selectedCity || gym.place?.includes(selectedCity);
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || 
      gym.name.toLowerCase().includes(q) || 
      gym.place?.toLowerCase().includes(q) ||
      gym.address.toLowerCase().includes(q) ||
      gym.city.toLowerCase().includes(q) ||
      gym.facilities?.some(f => f.toLowerCase().includes(q));

    return matchesCity && matchesSearch;
  });

  const citiesList = ['ALL', ...new Set(branches.map(g => g.city))];

  const handleOpenGymModal = (gym, tab = 'OVERVIEW') => {
    setActiveGymModal(gym);
    setModalTab(tab);
  };

  return (
    <div className="d-flex flex-column gap-4">
      {/* Header Banner */}
      <div className="glass-card p-4 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
        <div>
          <span className="badge badge-active mb-2">Gymkhana Official Network</span>
          <h3 className="text-white font-weight-bold mb-1">Gym Branches</h3>
          <p className="text-muted mb-0">Explore training centers across the nation, check live capacity, book slots, and generate digital access passes.</p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <div className="glass-card-static px-3 py-2 rounded-3 text-center">
            <span className="text-muted small d-block">Total Branches</span>
            <strong className="text-cyan fs-5">{branches.length} Locations</strong>
          </div>
          <div className="glass-card-static px-3 py-2 rounded-3 text-center">
            <span className="text-muted small d-block">Active Passes</span>
            <strong className="text-success fs-5">{bookings.length} Passes</strong>
          </div>
        </div>
      </div>

      {/* Active Passes Banner */}
      {bookings.length > 0 && (
        <div className="glass-card p-3 p-md-4 rounded-3 border border-success border-opacity-40 bg-success bg-opacity-10">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div className="d-flex align-items-center gap-3">
              <div className="p-3 bg-dark rounded-circle text-success border border-success border-opacity-30">
                <FiCheckCircle size={24} />
              </div>
              <div>
                <span className="badge badge-active mb-1">CONFIRMED GYM PASS</span>
                <h5 className="text-white font-weight-bold mb-0">{bookings[0].gym_name}</h5>
                <small className="text-muted">
                  📍 {bookings[0].gym_place} • {bookings[0].booking_date} @ <strong className="text-cyan">{bookings[0].slot_time}</strong>
                </small>
              </div>
            </div>
            <button
              onClick={() => setViewPassBooking(bookings[0])}
              className="btn btn-cyan-gradient d-flex align-items-center gap-2"
            >
              <FiGrid size={16} />
              <span>View Digital Pass ({bookings[0].pass_code})</span>
            </button>
          </div>
        </div>
      )}

      {/* Search & City Filter Bar */}
      <div className="glass-card-static p-3 rounded-3 d-flex flex-column flex-md-row gap-3 align-items-md-center justify-content-between">
        <div className="position-relative flex-grow-1" style={{ maxWidth: '400px' }}>
          <FiSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" size={16} />
          <input
            type="text"
            className="form-control bg-dark text-white border-secondary ps-5"
            placeholder="Search branches, places, amenities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="d-flex flex-wrap gap-1 align-items-center">
          <small className="text-muted me-2 small">City Filter:</small>
          {citiesList.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`btn btn-sm ${
                selectedCity === city ? 'btn-primary-gradient' : 'btn-secondary-glass'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Branches Grid */}
      <div className="row g-3 g-md-4">
        {filteredBranches.map((gym) => (
          <div key={gym.id} className="col-12 col-md-6 col-xl-4">
            <div className="glass-card rounded-4 h-100 d-flex flex-column overflow-hidden border border-secondary border-opacity-25 hover-lift">
              {/* Gym Image */}
              <div className="position-relative" style={{ height: '170px' }}>
                <img
                  src={gym.image}
                  alt={gym.name}
                  className="w-100 h-100"
                  style={{ objectFit: 'cover' }}
                />
                <div 
                  className="position-absolute top-0 start-0 w-100 h-100"
                  style={{ background: 'linear-gradient(to bottom, rgba(15,23,42,0.2) 0%, rgba(15,23,42,0.9) 100%)' }}
                />
                <span className="badge badge-active position-absolute top-0 start-0 m-3">
                  📍 {gym.city}
                </span>
                <span className="badge bg-warning text-dark position-absolute top-0 end-0 m-3 d-flex align-items-center gap-1 fw-bold">
                  <FiStar size={12} fill="#000" /> {gym.rating} ({gym.reviews_count})
                </span>
              </div>

              {/* Branch Content */}
              <div className="p-3 p-sm-4 flex-grow-1 d-flex flex-column justify-content-between">
                <div>
                  <h5 className="text-white font-weight-bold mb-1">{gym.name}</h5>
                  <p className="text-cyan small fw-semibold mb-2">
                    <FiNavigation className="me-1" size={12} /> {gym.place}
                  </p>
                  <small className="text-muted d-block mb-3">
                    <FiMapPin size={12} className="me-1" /> {gym.address}
                  </small>

                  <div className="d-flex flex-wrap gap-2 text-muted small mb-3 glass-card-static p-2 rounded-2" style={{ fontSize: '0.75rem' }}>
                    <span className="d-flex align-items-center gap-1">
                      <FiClock size={12} className="text-cyan" /> {gym.operating_hours}
                    </span>
                    <span className="d-flex align-items-center gap-1">
                      <FiPhone size={12} className="text-cyan" /> {gym.phone}
                    </span>
                  </div>

                  {/* Facilities Badges */}
                  <div className="mb-3">
                    <small className="text-muted d-block mb-1 fw-semibold" style={{ fontSize: '0.72rem' }}>Key Facilities:</small>
                    <div className="d-flex flex-wrap gap-1">
                      {(gym.facilities || []).slice(0, 3).map((f, fIdx) => (
                        <span key={fIdx} className="badge badge-role" style={{ fontSize: '0.68rem' }}>
                          {f}
                        </span>
                      ))}
                      {(gym.facilities || []).length > 3 && (
                        <span className="badge bg-secondary text-white" style={{ fontSize: '0.68rem' }}>
                          +{(gym.facilities || []).length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="d-flex gap-2 pt-3 border-top border-secondary border-opacity-25">
                  <button
                    onClick={() => handleOpenGymModal(gym, 'OVERVIEW')}
                    className="btn btn-secondary-glass btn-sm flex-fill"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleOpenGymModal(gym, 'BOOK')}
                    className="btn btn-primary-gradient btn-sm flex-fill d-flex align-items-center justify-content-center gap-1"
                  >
                    <FiCalendar size={14} />
                    <span>Book Slot</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Gym Details & Slot Booking Modal */}
      {activeGymModal && (
        <GymDetailsModal
          gym={activeGymModal}
          allGyms={branches}
          initialTab={modalTab}
          onClose={() => setActiveGymModal(null)}
          onBookingSuccess={() => {
            refetch();
          }}
        />
      )}

      {/* Digital Pass Modal */}
      {viewPassBooking && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center z-3 p-3" 
          style={{ background: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(10px)' }}
        >
          <div className="glass-card p-4 p-sm-5 w-100 text-center position-relative" style={{ maxWidth: '460px', borderRadius: '24px' }}>
            <button 
              onClick={() => setViewPassBooking(null)} 
              className="btn-close btn-close-white position-absolute top-0 end-0 m-4" 
            />

            <div className="mb-3">
              <span className="badge badge-active mb-2">OFFICIAL GYMKHANA ENTRY PASS</span>
              <h4 className="text-white font-weight-bold mb-1">{viewPassBooking.gym_name}</h4>
              <p className="text-cyan small mb-0">📍 {viewPassBooking.gym_place}</p>
            </div>

            <div className="glass-card-static p-4 rounded-3 border border-success border-opacity-50 my-3 position-relative overflow-hidden">
              <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                <FiGrid size={48} className="text-cyan" />
              </div>
              <span className="badge bg-dark text-cyan font-monospace px-3 py-2 fs-6 tracking-wider d-inline-block mb-3 border border-cyan border-opacity-25">
                {viewPassBooking.pass_code}
              </span>

              <div className="text-start glass-card p-3 rounded-2 text-muted small d-flex flex-column gap-2">
                <div className="d-flex justify-content-between">
                  <span>Pass Type / Plan:</span>
                  <strong className="text-white">{viewPassBooking.plan_title || 'Day Pass'}</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Booking Date:</span>
                  <strong className="text-white">{viewPassBooking.booking_date}</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Time Slot:</span>
                  <strong className="text-cyan">{viewPassBooking.slot_time}</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Access Area:</span>
                  <strong className="text-white">{viewPassBooking.workout_type}</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Status:</span>
                  <span className="badge badge-status badge-active">{viewPassBooking.status}</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setViewPassBooking(null)}
              className="btn btn-primary-gradient w-100"
            >
              Done / Close Pass
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
