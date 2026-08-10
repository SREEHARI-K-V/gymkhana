import React, { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { SkeletonLoader } from '../../components/SkeletonLoader';
import { useNotification } from '../../context/NotificationContext';
import api from '../../services/api';
import { 
  FiMapPin, FiClock, FiPhone, FiStar, FiCalendar, 
  FiCheckCircle, FiActivity, FiFilter, FiSearch, 
  FiUser, FiInfo, FiDollarSign, FiShield, FiX, 
  FiAward, FiMail, FiLayers, FiGrid, FiNavigation, FiZap,
  FiList, FiCheck
} from 'react-icons/fi';

export const GymsBooking = () => {
  const { data, loading, error, refetch } = useFetch('/member/gyms');
  const { addToast } = useNotification();

  // Search & Filtering State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('ALL');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'

  // Modal & Selection State
  const [selectedGym, setSelectedGym] = useState(null);
  const [activeTab, setActiveTab] = useState('OVERVIEW'); // 'OVERVIEW', 'PLANS', 'TRAINERS', 'BOOK'
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [workoutType, setWorkoutType] = useState('Strength & Free Weights');
  const [bookingLoading, setBookingLoading] = useState(false);

  // Digital Pass Ticket Modal State
  const [viewPassBooking, setViewPassBooking] = useState(null);

  if (loading) return <SkeletonLoader count={4} height="200px" />;
  if (error) return <div className="alert alert-danger">{error}</div>;

  const gyms = data?.gyms || [];
  const bookings = data?.bookings || [];

  // Filtered Gyms
  const filteredGyms = gyms.filter((gym) => {
    const matchesCity = selectedCity === 'ALL' || gym.city === selectedCity || gym.place?.includes(selectedCity);
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || 
      gym.name.toLowerCase().includes(q) || 
      gym.place?.toLowerCase().includes(q) ||
      gym.address.toLowerCase().includes(q) ||
      gym.city.toLowerCase().includes(q) ||
      gym.facilities?.some(f => f.toLowerCase().includes(q)) ||
      gym.plans?.some(p => p.title.toLowerCase().includes(q));

    return matchesCity && matchesSearch;
  });

  const citiesList = ['ALL', ...new Set(gyms.map(g => g.city))];

  const handleOpenGymModal = (gym, initialTab = 'OVERVIEW') => {
    setSelectedGym(gym);
    setActiveTab(initialTab);
    const initialPlan = gym.plans && gym.plans.length > 0 ? gym.plans[0] : null;
    setSelectedPlan(initialPlan);
    setSelectedSlot(gym.available_slots?.[0] || '');
  };

  const handleSelectPlanAndBook = (plan) => {
    setSelectedPlan(plan);
    setActiveTab('BOOK');
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!selectedGym || !selectedSlot) {
      addToast('Please select a valid time slot.', 'danger');
      return;
    }

    setBookingLoading(true);
    try {
      const res = await api.post('/member/bookings', {
        gym_id: selectedGym.id,
        booking_date: bookingDate,
        slot_time: selectedSlot,
        workout_type: workoutType,
        plan_title: selectedPlan?.title || 'Day Pass',
        plan_price: selectedPlan?.price || 15
      });

      if (res.data.success) {
        addToast(`Slot successfully booked at ${selectedGym.name}!`, 'success');
        setViewPassBooking(res.data.booking);
        setSelectedGym(null);
        refetch();
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to book slot. Please try again.', 'danger');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column gap-4">
      {/* Header Banner */}
      <div className="glass-card p-4 position-relative overflow-hidden">
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
          <div>
            <span className="badge badge-active mb-2">Gymkhana Network Portal</span>
            <h3 className="text-white font-weight-bold mb-1">Gym Centers & Slot Booking</h3>
            <p className="text-muted mb-0">Explore training centers, view details, membership plans, available slots & manage bookings.</p>
          </div>
          <div className="d-flex align-items-center gap-3">
            <div className="glass-card-static px-3 py-2 rounded-3 text-center">
              <span className="text-muted small d-block">Available Centers</span>
              <strong className="text-cyan fs-5">{gyms.length} Gyms</strong>
            </div>
            <div className="glass-card-static px-3 py-2 rounded-3 text-center">
              <span className="text-muted small d-block">My Active Passes</span>
              <strong className="text-warning fs-5">{bookings.length} Passes</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Active Confirmed Gym Passes Bar */}
      {bookings.length > 0 && (
        <div className="glass-card-static p-4 border border-success border-opacity-25">
          <h5 className="text-white font-weight-bold mb-3 d-flex align-items-center gap-2">
            <FiCheckCircle className="text-success" /> My Confirmed Gym Passes & Bookings ({bookings.length})
          </h5>
          <div className="row g-3">
            {bookings.map((b) => (
              <div key={b.id} className="col-12 col-md-6 col-lg-4">
                <div className="glass-card p-3 rounded-3 d-flex flex-column justify-content-between h-100 border border-success border-opacity-25">
                  <div>
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <span className="badge badge-status badge-active">{b.status}</span>
                      <span className="badge badge-role font-monospace">{b.pass_code}</span>
                    </div>
                    <h6 className="text-white font-weight-bold mb-1">{b.gym_name}</h6>
                    <small className="text-muted d-block mb-2">
                      <FiMapPin size={12} className="me-1 text-cyan" />
                      {b.gym_place || b.gym_address}
                    </small>
                    <div className="p-2 glass-card-static rounded-2 mb-2">
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <small className="text-cyan fw-bold">
                          <FiCalendar size={12} className="me-1" />
                          {b.booking_date} | {b.slot_time}
                        </small>
                        {b.plan_title && (
                          <span className="badge bg-primary bg-opacity-25 text-cyan" style={{ fontSize: '0.7rem' }}>
                            {b.plan_title} (${b.plan_price})
                          </span>
                        )}
                      </div>
                      <small className="text-white d-block">
                        <FiActivity size={12} className="me-1 text-warning" />
                        Access: {b.workout_type}
                      </small>
                    </div>
                  </div>
                  <button 
                    onClick={() => setViewPassBooking(b)}
                    className="btn btn-secondary-glass btn-sm w-100 mt-2 d-flex align-items-center justify-content-center gap-2"
                  >
                    <FiGrid size={14} />
                    <span>View Digital Pass</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search, Filter & Layout Switcher Bar */}
      <div className="glass-card p-4">
        <div className="row g-3 align-items-center">
          {/* Search Box */}
          <div className="col-12 col-md-5">
            <div className="position-relative">
              <FiSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" size={18} />
              <input
                type="text"
                className="form-control glass-input ps-5"
                placeholder="Search gyms by name, place, address, or plans..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')} 
                  className="btn btn-link text-muted position-absolute top-50 end-0 translate-middle-y me-2 p-0 text-decoration-none"
                >
                  <FiX size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Place Filter Pills */}
          <div className="col-12 col-md-5">
            <div className="d-flex align-items-center gap-2 overflow-x-auto pb-1">
              <span className="text-muted small fw-semibold me-1 text-nowrap">
                <FiFilter className="me-1 text-cyan" /> Location:
              </span>
              {citiesList.map((city) => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`btn btn-sm text-nowrap rounded-pill ${
                    selectedCity === city 
                      ? 'btn-cyan-gradient font-weight-bold' 
                      : 'btn-secondary-glass text-muted'
                  }`}
                  style={{ fontSize: '0.8rem' }}
                >
                  {city === 'ALL' ? '📍 All Places' : city}
                </button>
              ))}
            </div>
          </div>

          {/* View Switcher (List vs Grid) */}
          <div className="col-12 col-md-2 d-flex justify-content-md-end">
            <div className="btn-group p-1 glass-card-static rounded-3" role="group">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`btn btn-sm d-flex align-items-center gap-1 ${viewMode === 'list' ? 'btn-cyan-gradient fw-bold' : 'text-muted btn-link text-decoration-none'}`}
                title="Structured List View"
              >
                <FiList size={16} />
                <span>List</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`btn btn-sm d-flex align-items-center gap-1 ${viewMode === 'grid' ? 'btn-cyan-gradient fw-bold' : 'text-muted btn-link text-decoration-none'}`}
                title="Grid Cards View"
              >
                <FiGrid size={16} />
                <span>Grid</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Gym Centers List Container */}
      <div>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h4 className="text-white font-weight-bold mb-0 d-flex align-items-center gap-2">
            <FiMapPin className="text-cyan" /> Gym Centers & Details ({filteredGyms.length})
          </h4>
          {searchQuery && (
            <span className="text-muted small">Search results for "{searchQuery}"</span>
          )}
        </div>

        {filteredGyms.length === 0 ? (
          <div className="glass-card p-5 text-center text-muted">
            <FiMapPin size={40} className="mb-3 opacity-50 text-cyan" />
            <h5>No Gym Centers Found</h5>
            <p className="mb-3">Try adjusting your search query or location filter.</p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedCity('ALL'); }}
              className="btn btn-secondary-glass btn-sm"
            >
              Reset Filters
            </button>
          </div>
        ) : viewMode === 'list' ? (
          /* STRUCTURED LIST VIEW */
          <div className="d-flex flex-column gap-3">
            {filteredGyms.map((gym) => (
              <div 
                key={gym.id} 
                className="glass-card p-4 rounded-3 border border-secondary border-opacity-25 hover-lift position-relative overflow-hidden"
              >
                <div className="row g-3 align-items-center">
                  {/* Gym Image & Quick Badges */}
                  <div className="col-12 col-md-3">
                    <div className="position-relative rounded-3 overflow-hidden" style={{ height: '150px' }}>
                      <img 
                        src={gym.image} 
                        alt={gym.name} 
                        className="w-100 h-100 object-fit-cover"
                        style={{ filter: 'brightness(0.9)' }}
                      />
                      <div className="position-absolute top-0 start-0 m-2 badge badge-active shadow-sm" style={{ fontSize: '0.7rem' }}>
                        📍 {gym.city}
                      </div>
                      <div className="position-absolute bottom-0 start-0 m-2 badge bg-dark bg-opacity-80 text-warning d-flex align-items-center gap-1" style={{ fontSize: '0.7rem' }}>
                        <FiStar size={11} fill="#EAB308" />
                        <span>{gym.rating}</span> ({gym.reviews_count || 150})
                      </div>
                    </div>
                  </div>

                  {/* Main Details (Name, Place, Address, Operating Hours) */}
                  <div className="col-12 col-md-6">
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <h5 className="text-white font-weight-bold mb-0">{gym.name}</h5>
                      <span className="badge bg-primary bg-opacity-25 text-cyan ms-auto ms-md-0" style={{ fontSize: '0.75rem' }}>
                        {gym.capacity_status || 'Open Today'}
                      </span>
                    </div>

                    <p className="text-cyan small mb-1 fw-semibold d-flex align-items-center gap-1">
                      <FiNavigation size={13} />
                      <span>Place/Area: {gym.place || gym.city}</span>
                    </p>

                    <small className="text-muted d-block mb-2">
                      <FiMapPin size={12} className="me-1" />
                      {gym.address} {gym.landmark && `• Landmark: ${gym.landmark}`}
                    </small>

                    <div className="d-flex flex-wrap align-items-center gap-3 text-muted small mb-2">
                      <span><FiClock className="me-1 text-cyan" size={13} />{gym.operating_hours}</span>
                      <span><FiPhone className="me-1 text-cyan" size={13} />{gym.phone}</span>
                    </div>

                    {/* Plans & Pricing Row */}
                    {gym.plans && gym.plans.length > 0 && (
                      <div className="mt-2 pt-2 border-top border-secondary border-opacity-25">
                        <small className="text-white d-block mb-1 fw-semibold">
                          <FiDollarSign size={13} className="text-success me-1" />
                          Membership Plans:
                        </small>
                        <div className="d-flex flex-wrap gap-2">
                          {gym.plans.map((p, idx) => (
                            <span 
                              key={idx} 
                              className="badge bg-dark border border-primary border-opacity-25 text-white"
                              style={{ fontSize: '0.75rem' }}
                            >
                              {p.title}: <strong className="text-cyan">${p.price}</strong>/{p.period?.replace('per ', '')}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Available Slots & Quick Action Buttons */}
                  <div className="col-12 col-md-3 border-start-md border-secondary border-opacity-25 ps-md-4 d-flex flex-column justify-content-between h-100">
                    <div>
                      <small className="text-muted d-block mb-1 fw-semibold">
                        <FiClock size={12} className="me-1 text-warning" />
                        Available Slots:
                      </small>
                      <div className="d-flex flex-wrap gap-1 mb-3">
                        {gym.available_slots?.slice(0, 3).map((slot, sIdx) => (
                          <span key={sIdx} className="badge badge-role" style={{ fontSize: '0.7rem' }}>
                            {slot.split(' - ')[0]}
                          </span>
                        ))}
                        {gym.available_slots && gym.available_slots.length > 3 && (
                          <span className="badge bg-secondary text-white" style={{ fontSize: '0.7rem' }}>
                            +{gym.available_slots.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="d-flex flex-column gap-2 mt-auto">
                      <button
                        onClick={() => handleOpenGymModal(gym, 'OVERVIEW')}
                        className="btn btn-secondary-glass btn-sm w-100 d-flex align-items-center justify-content-center gap-2"
                      >
                        <FiInfo size={14} />
                        <span>View Details & Plans</span>
                      </button>
                      <button
                        onClick={() => handleOpenGymModal(gym, 'BOOK')}
                        className="btn btn-primary-gradient btn-sm w-100 d-flex align-items-center justify-content-center gap-2"
                      >
                        <FiCalendar size={14} />
                        <span>Book Slot Now</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* GRID CARDS VIEW */
          <div className="row g-4">
            {filteredGyms.map((gym) => (
              <div key={gym.id} className="col-12 col-md-6">
                <div className="glass-card overflow-hidden h-100 d-flex flex-column justify-content-between border border-secondary border-opacity-25 hover-lift">
                  <div>
                    {/* Header Image with Badges */}
                    <div className="position-relative" style={{ height: '200px', overflow: 'hidden' }}>
                      <img 
                        src={gym.image} 
                        alt={gym.name} 
                        className="w-100 h-100 object-fit-cover"
                        style={{ filter: 'brightness(0.85)' }}
                      />
                      <div className="position-absolute top-0 end-0 m-3 badge bg-dark bg-opacity-75 backdrop-blur text-warning d-flex align-items-center gap-1 py-1 px-2 border border-warning border-opacity-25">
                        <FiStar size={14} fill="#EAB308" color="#EAB308" />
                        <span className="fw-bold">{gym.rating}</span>
                        <span className="text-muted small">({gym.reviews_count || 150})</span>
                      </div>
                      <div className="position-absolute top-0 start-0 m-3 badge badge-active shadow-sm">
                        📍 {gym.city}
                      </div>
                      <div className="position-absolute bottom-0 start-0 m-3 badge bg-dark bg-opacity-80 text-cyan d-flex align-items-center gap-1 py-1 px-2">
                        <FiZap size={12} className="text-warning" />
                        <span>{gym.capacity_status || 'Open Today'}</span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-4">
                      <h5 className="text-white font-weight-bold mb-1">{gym.name}</h5>
                      <p className="text-cyan small mb-2 fw-semibold">
                        <FiNavigation className="me-1" size={13} />
                        Place: {gym.place || gym.address}
                      </p>
                      <small className="text-muted d-block mb-3">
                        <FiMapPin className="me-1 text-muted" size={12} />
                        {gym.address} {gym.landmark && `• (${gym.landmark})`}
                      </small>

                      <div className="d-flex flex-wrap align-items-center gap-3 mb-3 text-muted small glass-card-static p-2 rounded-2">
                        <span className="d-flex align-items-center gap-1">
                          <FiClock size={14} className="text-cyan" />
                          {gym.operating_hours}
                        </span>
                        <span className="d-flex align-items-center gap-1">
                          <FiPhone size={14} className="text-cyan" />
                          {gym.phone}
                        </span>
                      </div>

                      {/* Plans Quick Preview */}
                      {gym.plans && gym.plans.length > 0 && (
                        <div className="mb-3">
                          <small className="text-white d-block mb-1 fw-semibold">
                            <FiDollarSign size={13} className="text-success me-1" />
                            Available Plans & Passes:
                          </small>
                          <div className="d-flex flex-wrap gap-2">
                            {gym.plans.map((p, pIdx) => (
                              <span 
                                key={pIdx} 
                                className="badge bg-dark border border-primary border-opacity-25 text-white" 
                                style={{ fontSize: '0.75rem' }}
                              >
                                {p.title}: <strong className="text-cyan">${p.price}</strong>/{p.period?.replace('per ', '')}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Facilities Badges */}
                      <div>
                        <small className="text-muted d-block mb-1 fw-semibold">Facilities:</small>
                        <div className="d-flex flex-wrap gap-1">
                          {gym.facilities?.map((fac, idx) => (
                            <span key={idx} className="badge badge-role" style={{ fontSize: '0.72rem' }}>
                              {fac}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Action Buttons */}
                  <div className="p-4 pt-0 d-flex flex-column flex-sm-row gap-2">
                    <button
                      onClick={() => handleOpenGymModal(gym, 'OVERVIEW')}
                      className="btn btn-secondary-glass flex-fill d-flex align-items-center justify-content-center gap-2"
                    >
                      <FiInfo size={16} />
                      <span>View Details</span>
                    </button>
                    <button
                      onClick={() => handleOpenGymModal(gym, 'BOOK')}
                      className="btn btn-primary-gradient flex-fill d-flex align-items-center justify-content-center gap-2"
                    >
                      <FiCalendar size={16} />
                      <span>Book Gym Slot</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Comprehensive Gym Details & Slot Booking Modal */}
      {selectedGym && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center z-3 p-3 overflow-y-auto" 
          style={{ background: 'rgba(0, 0, 0, 0.82)', backdropFilter: 'blur(10px)' }}
        >
          <div className="glass-card p-4 p-sm-5 w-100 my-auto" style={{ maxWidth: '780px', borderRadius: '24px' }}>
            {/* Modal Header */}
            <div className="d-flex align-items-start justify-content-between mb-3 border-bottom border-secondary border-opacity-25 pb-3">
              <div>
                <div className="d-flex align-items-center gap-2 mb-1">
                  <span className="badge badge-active">📍 {selectedGym.city}</span>
                  <span className="badge bg-warning bg-opacity-25 text-warning d-flex align-items-center gap-1">
                    <FiStar size={12} fill="#EAB308" /> {selectedGym.rating} ({selectedGym.reviews_count || 150} reviews)
                  </span>
                </div>
                <h4 className="text-white font-weight-bold mb-1">{selectedGym.name}</h4>
                <p className="text-cyan small mb-0 fw-semibold">
                  <FiNavigation className="me-1" size={13} />
                  Place: {selectedGym.place || selectedGym.address}
                </p>
              </div>
              <button 
                onClick={() => setSelectedGym(null)} 
                className="btn-close btn-close-white ms-3" 
              />
            </div>

            {/* Modal Tabs Navigation */}
            <div className="d-flex align-items-center gap-2 mb-4 border-bottom border-secondary border-opacity-25 pb-2 overflow-x-auto">
              <button
                onClick={() => setActiveTab('OVERVIEW')}
                className={`btn btn-sm text-nowrap rounded-pill ${
                  activeTab === 'OVERVIEW' ? 'btn-cyan-gradient font-weight-bold' : 'btn-secondary-glass text-muted'
                }`}
              >
                <FiInfo className="me-1" /> Overview & Place Details
              </button>
              <button
                onClick={() => setActiveTab('PLANS')}
                className={`btn btn-sm text-nowrap rounded-pill ${
                  activeTab === 'PLANS' ? 'btn-cyan-gradient font-weight-bold' : 'btn-secondary-glass text-muted'
                }`}
              >
                <FiDollarSign className="me-1" /> Plans & Pricing ({selectedGym.plans?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('TRAINERS')}
                className={`btn btn-sm text-nowrap rounded-pill ${
                  activeTab === 'TRAINERS' ? 'btn-cyan-gradient font-weight-bold' : 'btn-secondary-glass text-muted'
                }`}
              >
                <FiUser className="me-1" /> Coaches & Amenities
              </button>
              <button
                onClick={() => setActiveTab('BOOK')}
                className={`btn btn-sm text-nowrap rounded-pill ${
                  activeTab === 'BOOK' ? 'btn-primary-gradient font-weight-bold' : 'btn-secondary-glass text-muted'
                }`}
              >
                <FiCalendar className="me-1" /> Book Slot Now
              </button>
            </div>

            {/* TAB 1: OVERVIEW & PLACE DETAILS */}
            {activeTab === 'OVERVIEW' && (
              <div className="d-flex flex-column gap-3">
                <div className="glass-card-static p-3 rounded-3">
                  <h6 className="text-white font-weight-bold mb-2">About This Gym Center</h6>
                  <p className="text-muted small mb-0">
                    {selectedGym.description || 'Modern, clean, and fully equipped Gymkhana fitness facility offering premium strength training gear, functional turf areas, and luxury wellness facilities.'}
                  </p>
                </div>

                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <div className="glass-card p-3 rounded-3 h-100">
                      <h6 className="text-cyan font-weight-bold mb-2 d-flex align-items-center gap-1">
                        <FiMapPin size={15} /> Location & Place Information
                      </h6>
                      <ul className="list-unstyled text-muted small mb-0 d-flex flex-column gap-2">
                        <li><strong className="text-white">Place/Area:</strong> {selectedGym.place || selectedGym.city}</li>
                        <li><strong className="text-white">Street Address:</strong> {selectedGym.address}</li>
                        {selectedGym.landmark && (
                          <li><strong className="text-white">Landmark:</strong> {selectedGym.landmark}</li>
                        )}
                        <li><strong className="text-white">City Zone:</strong> {selectedGym.city}</li>
                      </ul>
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="glass-card p-3 rounded-3 h-100">
                      <h6 className="text-cyan font-weight-bold mb-2 d-flex align-items-center gap-1">
                        <FiClock size={15} /> Operational & Contact Details
                      </h6>
                      <ul className="list-unstyled text-muted small mb-0 d-flex flex-column gap-2">
                        <li><strong className="text-white">Hours:</strong> {selectedGym.operating_hours}</li>
                        <li><strong className="text-white">Helpdesk Phone:</strong> {selectedGym.phone}</li>
                        {selectedGym.email && (
                          <li><strong className="text-white">Email:</strong> {selectedGym.email}</li>
                        )}
                        {selectedGym.manager && (
                          <li><strong className="text-white">Center Manager:</strong> {selectedGym.manager}</li>
                        )}
                        <li>
                          <strong className="text-white">Current Capacity:</strong>{' '}
                          <span className="badge badge-active">{selectedGym.capacity_status || 'Moderate (60% Occupied)'}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="d-flex align-items-center justify-content-end gap-2 mt-3 pt-3 border-top border-secondary border-opacity-25">
                  <button 
                    onClick={() => setActiveTab('PLANS')} 
                    className="btn btn-secondary-glass d-flex align-items-center gap-2"
                  >
                    <span>View Membership Plans</span> →
                  </button>
                  <button 
                    onClick={() => setActiveTab('BOOK')} 
                    className="btn btn-primary-gradient d-flex align-items-center gap-2"
                  >
                    <FiCalendar size={16} />
                    <span>Proceed to Book Slot</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: PLANS & PRICING */}
            {activeTab === 'PLANS' && (
              <div className="d-flex flex-column gap-3">
                <p className="text-muted small mb-1">
                  Choose a pass or membership plan for <strong>{selectedGym.name}</strong> to proceed with slot booking:
                </p>
                <div className="row g-3">
                  {selectedGym.plans?.map((plan) => (
                    <div key={plan.id} className="col-12 col-md-6">
                      <div 
                        className={`glass-card p-3 rounded-3 h-100 d-flex flex-column justify-content-between border ${
                          selectedPlan?.id === plan.id 
                            ? 'border-primary border-2 bg-primary bg-opacity-10' 
                            : 'border-secondary border-opacity-25'
                        }`}
                      >
                        <div>
                          <div className="d-flex align-items-center justify-content-between mb-2">
                            <h6 className="text-white font-weight-bold mb-0">{plan.title}</h6>
                            {selectedPlan?.id === plan.id && (
                              <span className="badge badge-active">SELECTED</span>
                            )}
                          </div>
                          <div className="d-flex align-items-baseline gap-1 mb-2">
                            <span className="fs-3 font-weight-bold text-cyan">${plan.price}</span>
                            <span className="text-muted small">/ {plan.period}</span>
                          </div>
                          <ul className="list-unstyled mb-3">
                            {plan.benefits?.map((b, bIdx) => (
                              <li key={bIdx} className="text-muted small d-flex align-items-center gap-2 mb-1">
                                <FiCheckCircle className="text-success" size={13} />
                                <span>{b}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <button
                          onClick={() => handleSelectPlanAndBook(plan)}
                          className={`btn btn-sm w-100 ${
                            selectedPlan?.id === plan.id 
                              ? 'btn-primary-gradient' 
                              : 'btn-secondary-glass'
                          }`}
                        >
                          {selectedPlan?.id === plan.id ? 'Book Slot with This Plan' : 'Select Plan & Book'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: COACHES & AMENITIES */}
            {activeTab === 'TRAINERS' && (
              <div className="d-flex flex-column gap-3">
                {/* Certified Coaches */}
                {selectedGym.trainers && selectedGym.trainers.length > 0 && (
                  <div>
                    <h6 className="text-white font-weight-bold mb-2 d-flex align-items-center gap-2">
                      <FiUser className="text-cyan" /> Featured Coaches & Trainers
                    </h6>
                    <div className="row g-2">
                      {selectedGym.trainers.map((t, idx) => (
                        <div key={idx} className="col-12 col-md-6">
                          <div className="glass-card-static p-3 rounded-3 d-flex align-items-center gap-3">
                            <div className="bg-primary bg-opacity-25 rounded-circle p-2 text-cyan d-flex align-items-center justify-content-center" style={{ width: '42px', height: '42px' }}>
                              <FiUser size={20} />
                            </div>
                            <div>
                              <h6 className="text-white font-weight-bold mb-0">{t.name}</h6>
                              <small className="text-cyan d-block">{t.role}</small>
                              <small className="text-muted">Experience: {t.exp}</small>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* All Facilities */}
                <div>
                  <h6 className="text-white font-weight-bold mb-2 d-flex align-items-center gap-2">
                    <FiLayers className="text-cyan" /> Full Amenities & Facilities List
                  </h6>
                  <div className="row g-2">
                    {selectedGym.facilities?.map((fac, idx) => (
                      <div key={idx} className="col-6 col-md-4">
                        <div className="glass-card p-2 rounded-2 d-flex align-items-center gap-2 text-muted small">
                          <FiCheckCircle className="text-success" size={14} />
                          <span className="text-white">{fac}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="d-flex align-items-center justify-content-end mt-3 pt-3 border-top border-secondary border-opacity-25">
                  <button 
                    onClick={() => setActiveTab('BOOK')} 
                    className="btn btn-primary-gradient d-flex align-items-center gap-2"
                  >
                    <FiCalendar size={16} />
                    <span>Proceed to Book Slot</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 4: BOOK SLOT NOW FORM */}
            {activeTab === 'BOOK' && (
              <form onSubmit={handleConfirmBooking} className="d-flex flex-column gap-3">
                {/* Plan Selection Banner inside Form */}
                <div className="glass-card p-3 rounded-3 border border-cyan border-opacity-25 d-flex align-items-center justify-content-between">
                  <div>
                    <span className="text-muted small d-block">Selected Plan:</span>
                    <h6 className="text-white font-weight-bold mb-0">
                      {selectedPlan ? selectedPlan.title : 'Day Pass'}{' '}
                      <span className="text-cyan">(${selectedPlan ? selectedPlan.price : 15})</span>
                    </h6>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setActiveTab('PLANS')} 
                    className="btn btn-link text-cyan p-0 small fw-bold text-decoration-none"
                  >
                    Change Plan
                  </button>
                </div>

                {/* Date Selection */}
                <div>
                  <label className="form-label-custom">Select Booking Date</label>
                  <input
                    type="date"
                    className="form-control glass-input"
                    min={new Date().toISOString().split('T')[0]}
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    required
                  />
                </div>

                {/* Time Slot Selection */}
                <div>
                  <label className="form-label-custom">Available Training Time Slot</label>
                  <select
                    className="form-select glass-input"
                    value={selectedSlot}
                    onChange={(e) => setSelectedSlot(e.target.value)}
                    required
                  >
                    {selectedGym.available_slots?.map((slot, i) => (
                      <option key={i} value={slot} style={{ background: '#0F172A', color: '#FFF' }}>
                        🕒 {slot}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Workout Focus */}
                <div>
                  <label className="form-label-custom">Workout / Facility Access Zone</label>
                  <select
                    className="form-select glass-input"
                    value={workoutType}
                    onChange={(e) => setWorkoutType(e.target.value)}
                  >
                    <option value="Strength & Free Weights" style={{ background: '#0F172A', color: '#FFF' }}>Strength & Free Weights Floor</option>
                    <option value="Cardio & Functional Floor" style={{ background: '#0F172A', color: '#FFF' }}>Cardio & Functional Floor</option>
                    <option value="HIIT & Boxing Studio" style={{ background: '#0F172A', color: '#FFF' }}>HIIT & Boxing Studio</option>
                    <option value="Sauna & Recovery Spa" style={{ background: '#0F172A', color: '#FFF' }}>Sauna & Recovery Spa</option>
                    <option value="Personal Trainer Session" style={{ background: '#0F172A', color: '#FFF' }}>Personal Trainer Session</option>
                  </select>
                </div>

                {/* Pass Preview Details Box */}
                <div className="glass-card-static p-3 rounded-3 mt-1">
                  <small className="text-cyan fw-bold d-block mb-1">Pass Summary Details:</small>
                  <div className="d-flex flex-column gap-1 text-muted small">
                    <div><strong>Gym Center:</strong> {selectedGym.name}</div>
                    <div><strong>Place / Location:</strong> {selectedGym.place || selectedGym.address}</div>
                    <div><strong>Scheduled Date & Slot:</strong> {bookingDate} @ {selectedSlot}</div>
                    <div><strong>Access Tier:</strong> {workoutType}</div>
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="d-flex align-items-center justify-content-end gap-2 mt-3 pt-2 border-top border-secondary border-opacity-25">
                  <button
                    type="button"
                    onClick={() => setSelectedGym(null)}
                    className="btn btn-secondary-glass"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="btn btn-primary-gradient d-flex align-items-center gap-2"
                  >
                    {bookingLoading ? (
                      <span>Reserving Slot...</span>
                    ) : (
                      <>
                        <FiCheckCircle size={16} />
                        <span>Confirm Gym Slot Pass</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Digital Gym Entry Pass Modal */}
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
              <p className="text-cyan small mb-0">📍 {viewPassBooking.gym_place || viewPassBooking.gym_address}</p>
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

            <p className="text-muted extra-small mb-3">
              Show this digital entry pass at the front desk scanner upon arrival.
            </p>

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
