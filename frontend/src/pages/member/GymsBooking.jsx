import React, { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { SkeletonLoader } from '../../components/SkeletonLoader';
import { useNotification } from '../../context/NotificationContext';
import api from '../../services/api';
import { 
  FiMapPin, FiClock, FiPhone, FiStar, FiCalendar, 
  FiCheckCircle, FiPlusCircle, FiActivity, FiFilter, FiTag
} from 'react-icons/fi';

export const GymsBooking = () => {
  const { data, loading, error, refetch } = useFetch('/member/gyms');
  const { addToast } = useNotification();

  const [selectedGym, setSelectedGym] = useState(null);
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [workoutType, setWorkoutType] = useState('Strength & Free Weights');
  const [bookingLoading, setBookingLoading] = useState(false);

  if (loading) return <SkeletonLoader count={4} height="200px" />;
  if (error) return <div className="alert alert-danger">{error}</div>;

  const gyms = data?.gyms || [];
  const bookings = data?.bookings || [];

  const handleOpenBookingModal = (gym) => {
    setSelectedGym(gym);
    setSelectedSlot(gym.available_slots[0] || '');
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
        workout_type: workoutType
      });

      if (res.data.success) {
        addToast(`Slot successfully booked at ${selectedGym.name}!`, 'success');
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
      <div className="glass-card p-4 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 position-relative overflow-hidden">
        <div>
          <span className="badge badge-active mb-2">Gymkhana Network</span>
          <h3 className="text-white font-weight-bold mb-1">Gym Locations & Slot Booking</h3>
          <p className="text-muted mb-0">Book your training slot at any Gymkhana center across the network.</p>
        </div>
      </div>

      {/* Active Bookings Section */}
      {bookings.length > 0 && (
        <div className="glass-card-static p-4">
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
                      <span className="badge badge-role">{b.pass_code}</span>
                    </div>
                    <h6 className="text-white font-weight-bold mb-1">{b.gym_name}</h6>
                    <small className="text-muted d-block mb-2">
                      <FiMapPin size={12} className="me-1 text-cyan" />
                      {b.gym_address}
                    </small>
                    <div className="p-2 glass-card-static rounded-2 mb-2">
                      <small className="text-cyan d-block fw-bold mb-1">
                        <FiCalendar size={12} className="me-1" />
                        {b.booking_date} | {b.slot_time}
                      </small>
                      <small className="text-white d-block">
                        <FiActivity size={12} className="me-1 text-warning" />
                        Access: {b.workout_type}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gym Locations Grid */}
      <div>
        <h4 className="text-white font-weight-bold mb-3 d-flex align-items-center gap-2">
          <FiMapPin className="text-cyan" /> Available Gym Centers ({gyms.length})
        </h4>

        <div className="row g-4">
          {gyms.map((gym) => (
            <div key={gym.id} className="col-12 col-md-6">
              <div className="glass-card overflow-hidden h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="position-relative" style={{ height: '180px', overflow: 'hidden' }}>
                    <img 
                      src={gym.image} 
                      alt={gym.name} 
                      className="w-100 h-100 object-fit-cover"
                      style={{ filter: 'brightness(0.85)' }}
                    />
                    <div className="position-absolute top-0 end-0 m-3 badge bg-dark bg-opacity-75 text-warning d-flex align-items-center gap-1 py-1 px-2">
                      <FiStar size={14} fill="#EAB308" color="#EAB308" />
                      <span className="fw-bold">{gym.rating}</span>
                    </div>
                    <div className="position-absolute bottom-0 start-0 m-3 badge badge-active">
                      {gym.city}
                    </div>
                  </div>

                  <div className="p-4">
                    <h5 className="text-white font-weight-bold mb-1">{gym.name}</h5>
                    <p className="text-muted small mb-3">
                      <FiMapPin className="me-1 text-cyan" size={14} />
                      {gym.address}
                    </p>

                    <div className="d-flex align-items-center gap-3 mb-3 text-muted small">
                      <span className="d-flex align-items-center gap-1">
                        <FiClock size={14} className="text-cyan" />
                        {gym.operating_hours}
                      </span>
                      <span className="d-flex align-items-center gap-1">
                        <FiPhone size={14} className="text-cyan" />
                        {gym.phone}
                      </span>
                    </div>

                    <div className="mb-3">
                      <small className="text-muted d-block mb-1 fw-semibold">Facilities Available:</small>
                      <div className="d-flex flex-wrap gap-1">
                        {gym.facilities.map((fac, idx) => (
                          <span key={idx} className="badge badge-role" style={{ fontSize: '0.72rem' }}>
                            {fac}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <button
                    onClick={() => handleOpenBookingModal(gym)}
                    className="btn btn-primary-gradient w-100 d-flex align-items-center justify-content-center gap-2"
                  >
                    <FiCalendar size={16} />
                    <span>Book Workout Slot</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Slot Booking Modal */}
      {selectedGym && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center z-3 p-3" style={{ background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(8px)' }}>
          <div className="glass-card p-4 p-sm-5 w-100" style={{ maxWidth: '500px', borderRadius: '20px' }}>
            <div className="d-flex align-items-center justify-content-between mb-3 border-bottom border-secondary border-opacity-25 pb-3">
              <div>
                <h5 className="text-white font-weight-bold mb-0">Book Slot: {selectedGym.name}</h5>
                <small className="text-cyan">{selectedGym.city}</small>
              </div>
              <button 
                onClick={() => setSelectedGym(null)} 
                className="btn-close btn-close-white" 
              />
            </div>

            <form onSubmit={handleConfirmBooking} className="d-flex flex-column gap-3">
              <div>
                <label className="form-label-custom">Select Date</label>
                <input
                  type="date"
                  className="form-control glass-input"
                  min={new Date().toISOString().split('T')[0]}
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="form-label-custom">Available Time Slots</label>
                <select
                  className="form-select glass-input"
                  value={selectedSlot}
                  onChange={(e) => setSelectedSlot(e.target.value)}
                  required
                >
                  {selectedGym.available_slots.map((slot, i) => (
                    <option key={i} value={slot} style={{ background: '#0F172A', color: '#FFF' }}>
                      🕒 {slot}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label-custom">Workout / Facility Access</label>
                <select
                  className="form-select glass-input"
                  value={workoutType}
                  onChange={(e) => setWorkoutType(e.target.value)}
                >
                  <option value="Strength & Free Weights" style={{ background: '#0F172A', color: '#FFF' }}>Strength & Free Weights</option>
                  <option value="Cardio & Functional Floor" style={{ background: '#0F172A', color: '#FFF' }}>Cardio & Functional Floor</option>
                  <option value="HIIT & Boxing Studio" style={{ background: '#0F172A', color: '#FFF' }}>HIIT & Boxing Studio</option>
                  <option value="Sauna & Recovery Spa" style={{ background: '#0F172A', color: '#FFF' }}>Sauna & Recovery Spa</option>
                  <option value="Personal Trainer Session" style={{ background: '#0F172A', color: '#FFF' }}>Personal Trainer Session</option>
                </select>
              </div>

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
                    <span>Booking...</span>
                  ) : (
                    <>
                      <FiCheckCircle size={16} />
                      <span>Confirm Booking Pass</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
