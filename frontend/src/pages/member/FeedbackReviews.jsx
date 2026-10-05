import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useFetch } from '../../hooks/useFetch';
import { useNotification } from '../../context/NotificationContext';
import api from '../../services/api';
import { SkeletonLoader } from '../../components/SkeletonLoader';
import { Modal } from '../../components/Modal';
import { 
  FiStar, FiMessageSquare, FiThumbsUp, FiCheckCircle, 
  FiEdit, FiMapPin, FiUser, FiFilter
} from 'react-icons/fi';

export const FeedbackReviews = () => {
  const { user } = useAuth();
  const { data, loading, error, refetch } = useFetch('/member/reviews');
  const { addToast } = useNotification();

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [filterRating, setFilterRating] = useState('ALL');
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    rating: 5,
    title: '',
    comment: '',
    category: 'Gym Facilities',
    branch_name: 'Gymkhana Elite Fitness - Downtown',
    trainer_name: 'Alex Vance'
  });

  if (loading) return <SkeletonLoader count={3} height="150px" />;
  if (error) return <div className="alert alert-danger">{error}</div>;

  const reviews = data?.reviews || [];
  const averageRating = data?.average_rating || 4.9;
  const totalReviews = data?.total_reviews || reviews.length;
  const breakdown = data?.breakdown || { 5: 3, 4: 1, 3: 0, 2: 0, 1: 0 };

  const filteredReviews = reviews.filter((r) => {
    if (filterRating === 'ALL') return true;
    return r.rating === Number(filterRating);
  });

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!formData.comment.trim()) {
      addToast('Please write a review comment', 'danger');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/member/reviews', formData);
      if (res.data.success) {
        addToast('Review submitted successfully! Thank you for your feedback.', 'success');
        setReviewModalOpen(false);
        setFormData({
          rating: 5,
          title: '',
          comment: '',
          category: 'Gym Facilities',
          branch_name: 'Gymkhana Elite Fitness - Downtown',
          trainer_name: 'Alex Vance'
        });
        refetch();
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Error submitting review', 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="d-flex flex-column gap-4">
      {/* Header Banner */}
      <div className="glass-card p-4 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
        <div>
          <span className="badge badge-active mb-2">Member Community Voices</span>
          <h3 className="text-white font-weight-bold mb-1">Feedback & Reviews</h3>
          <p className="text-muted mb-0">Share your experience with Gymkhana branches and trainers, or see what fellow athletes say.</p>
        </div>

        <button
          onClick={() => setReviewModalOpen(true)}
          className="btn btn-primary-gradient d-flex align-items-center gap-2 align-self-start align-self-md-center"
        >
          <FiEdit size={16} />
          <span>Write a Review</span>
        </button>
      </div>

      {/* Rating Summary Overview */}
      <div className="glass-card-static p-4">
        <div className="row align-items-center g-4">
          <div className="col-12 col-md-4 text-center border-end border-secondary border-opacity-25">
            <h1 className="text-white font-weight-bold display-4 mb-0">{averageRating}</h1>
            <div className="d-flex justify-content-center gap-1 my-2">
              {[...Array(5)].map((_, i) => (
                <FiStar
                  key={i}
                  size={20}
                  className={i < Math.floor(averageRating) ? 'text-warning' : 'text-muted'}
                  fill={i < Math.floor(averageRating) ? '#EAB308' : 'none'}
                />
              ))}
            </div>
            <span className="text-muted small">Based on {totalReviews} Verified Member Reviews</span>
          </div>

          <div className="col-12 col-md-8">
            <div className="d-flex flex-column gap-2" style={{ maxWidth: '480px' }}>
              {[5, 4, 3, 2, 1].map((star) => {
                const count = breakdown[star] || 0;
                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                return (
                  <div key={star} className="d-flex align-items-center gap-3 text-muted small">
                    <span className="d-flex align-items-center gap-1 text-white" style={{ minWidth: '45px' }}>
                      {star} <FiStar size={12} className="text-warning" fill="#EAB308" />
                    </span>
                    <div className="progress flex-grow-1" style={{ height: '8px', background: 'rgba(255, 255, 255, 0.1)' }}>
                      <div
                        className="progress-bar bg-warning"
                        role="progressbar"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span style={{ minWidth: '30px' }} className="text-end">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Filter & Feed */}
      <div className="glass-card-static p-4">
        <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 mb-4">
          <h5 className="text-white font-weight-bold mb-0 d-flex align-items-center gap-2">
            <FiMessageSquare className="text-cyan" /> Member Reviews ({filteredReviews.length})
          </h5>

          <div className="d-flex gap-1 align-items-center">
            <small className="text-muted me-2 small">Rating:</small>
            {['ALL', '5', '4'].map((r) => (
              <button
                key={r}
                onClick={() => setFilterRating(r)}
                className={`btn btn-sm ${
                  filterRating === r ? 'btn-primary-gradient' : 'btn-secondary-glass'
                }`}
              >
                {r === 'ALL' ? 'All Reviews' : `${r} ★ Stars`}
              </button>
            ))}
          </div>
        </div>

        <div className="d-flex flex-column gap-3">
          {filteredReviews.length === 0 ? (
            <div className="p-4 text-center text-muted">
              No reviews match this rating filter.
            </div>
          ) : (
            filteredReviews.map((rev) => (
              <div key={rev.id} className="glass-card p-3 p-sm-4 rounded-3 border border-secondary border-opacity-25">
                <div className="d-flex align-items-start justify-content-between flex-wrap gap-2 mb-2">
                  <div className="d-flex align-items-center gap-3">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0"
                      style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #4F46E5, #06B6D4)' }}
                    >
                      {rev.user_avatar || 'M'}
                    </div>
                    <div>
                      <div className="d-flex align-items-center gap-2">
                        <h6 className="text-white font-weight-bold mb-0">{rev.user_name}</h6>
                        <span className="badge badge-active" style={{ fontSize: '0.65rem' }}>
                          <FiCheckCircle className="me-1" /> Verified Member
                        </span>
                      </div>
                      <small className="text-muted">{rev.date} • Visited: <span className="text-cyan">{rev.branch_name}</span></small>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        size={14}
                        className={i < rev.rating ? 'text-warning' : 'text-muted'}
                        fill={i < rev.rating ? '#EAB308' : 'none'}
                      />
                    ))}
                    <span className="badge badge-role ms-2">{rev.category}</span>
                  </div>
                </div>

                <h6 className="text-white font-weight-bold mt-2 mb-1">{rev.title}</h6>
                <p className="text-muted small mb-3">{rev.comment}</p>

                {rev.response && (
                  <div className="p-3 glass-card-static rounded-3 border-start border-primary border-3 ms-2 mb-2">
                    <small className="text-cyan fw-bold d-block mb-1">Gymkhana Management Response:</small>
                    <small className="text-muted">{rev.response}</small>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Submit Review Modal */}
      {reviewModalOpen && (
        <Modal
          isOpen={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          title="Write a Member Review"
        >
          <form onSubmit={handleSubmitReview} className="d-flex flex-column gap-3">
            <div>
              <label className="form-label text-muted small fw-semibold">Rating (1 to 5 Stars)</label>
              <div className="d-flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                    className="btn btn-secondary-glass p-2 d-flex align-items-center justify-content-center"
                    style={{ width: '42px', height: '42px' }}
                  >
                    <FiStar
                      size={20}
                      className={star <= formData.rating ? 'text-warning' : 'text-muted'}
                      fill={star <= formData.rating ? '#EAB308' : 'none'}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="form-label text-muted small fw-semibold">Branch / Location</label>
              <select
                className="form-select bg-dark text-white border-secondary"
                value={formData.branch_name}
                onChange={(e) => setFormData(prev => ({ ...prev, branch_name: e.target.value }))}
              >
                <option value="Gymkhana Elite Fitness - Downtown">Gymkhana Elite Fitness - Downtown (Manhattan)</option>
                <option value="Gymkhana Powerhouse - Williamsburg">Gymkhana Powerhouse - Williamsburg (Brooklyn)</option>
                <option value="Gymkhana Wellness Hub - Queens Plaza">Gymkhana Wellness Hub - Queens Plaza</option>
                <option value="Gymkhana Performance Arena - Los Angeles">Gymkhana Performance Arena - Los Angeles</option>
                <option value="Gymkhana Coastal Club - Miami">Gymkhana Coastal Club - Miami</option>
              </select>
            </div>

            <div>
              <label className="form-label text-muted small fw-semibold">Feedback Category</label>
              <select
                className="form-select bg-dark text-white border-secondary"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              >
                <option value="Gym Facilities">Gym Facilities & Atmosphere</option>
                <option value="Personal Coaching">Personal Coaching & Trainers</option>
                <option value="Equipment & Space">Equipment & Cleanliness</option>
                <option value="Slot Booking Experience">Slot Booking & App Experience</option>
                <option value="General">General Feedback</option>
              </select>
            </div>

            <div>
              <label className="form-label text-muted small fw-semibold">Review Title</label>
              <input
                type="text"
                className="form-control bg-dark text-white border-secondary"
                placeholder="e.g. Great lifting gear and friendly coach"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div>
              <label className="form-label text-muted small fw-semibold">Your Review & Comments</label>
              <textarea
                className="form-control bg-dark text-white border-secondary"
                rows="4"
                placeholder="Share your experience with the machines, atmosphere, staff, or trainer guidance..."
                value={formData.comment}
                onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                required
              />
            </div>

            <div className="d-flex justify-content-end gap-2 pt-3 border-top border-secondary border-opacity-25">
              <button
                type="button"
                onClick={() => setReviewModalOpen(false)}
                className="btn btn-secondary-glass"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary-gradient"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
