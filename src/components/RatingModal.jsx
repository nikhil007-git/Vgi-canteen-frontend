import React, { useState } from 'react';
import { Star, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { vgiApi } from '../services/api';

export const RatingModal = ({ orderId, existingRating, onClose, onRatingSubmitted }) => {
  const [stars, setStars] = useState(existingRating?.stars || 5);
  const [hoverStars, setHoverStars] = useState(0);
  const [review, setReview] = useState(existingRating?.review || '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await vgiApi.submitRating(orderId, { stars, review });
      if (res.success) {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 }
        });
        if (onRatingSubmitted) onRatingSubmitted(res.rating);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Failed to submit rating.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Star className="w-6 h-6 fill-amber-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">How was your food?</h3>
          <p className="text-xs text-slate-500 mt-1">
            Your feedback helps the VGI Canteen kitchen improve daily meal quality.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Star selector */}
          <div className="flex items-center justify-center gap-2 py-2">
            {[1, 2, 3, 4, 5].map((starIndex) => (
              <button
                type="button"
                key={starIndex}
                onMouseEnter={() => setHoverStars(starIndex)}
                onMouseLeave={() => setHoverStars(0)}
                onClick={() => setStars(starIndex)}
                className="p-1 focus:outline-none transition-transform hover:scale-110 active:scale-95"
              >
                <Star
                  className={`w-8 h-8 ${
                    (hoverStars || stars) >= starIndex
                      ? 'text-amber-400 fill-amber-400 drop-shadow-xs'
                      : 'text-slate-200'
                  }`}
                />
              </button>
            ))}
          </div>

          <div className="text-center text-xs font-bold text-amber-600">
            {stars === 5 && 'Outstanding! Loved it 🔥'}
            {stars === 4 && 'Good taste & preparation! 👍'}
            {stars === 3 && 'Average experience 😐'}
            {stars === 2 && 'Needs improvement 👎'}
            {stars === 1 && 'Poor quality 😞'}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Review / Feedback <span className="font-normal text-slate-400">(Optional)</span>
            </label>
            <textarea
              rows={3}
              placeholder="Tell us what you liked or how we can improve..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50"
            >
              Skip
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-md shadow-brand-500/20 disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Rating'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

