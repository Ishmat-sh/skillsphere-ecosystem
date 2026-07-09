import { useState } from 'react';
import api from '../../services/api';

export default function TimelineLock({ escrow, animate = false }) {
  if (!escrow) return null;

  const progress = Math.round((escrow.releasedAmount / escrow.totalAmount) * 100);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      await api.post('/api/reviews', { escrowId: escrow._id, rating, comment: comment.trim() });
      setSubmitted(true);
      setComment('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 ${animate ? 'animate-pulse' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-[#A2A2D0]/60 uppercase tracking-wider">Escrow Vault</p>
          <p className="text-white font-semibold">{escrow.gig?.title || 'Contract'}</p>
        </div>
        <div className="relative">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF5E62]/30 via-[#7B61FF]/40 to-[#00D2FF]/30 border border-[#7B61FF]/40 flex items-center justify-center shadow-[0_0_24px_rgba(123,97,255,0.4)]">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          {escrow.status === 'locked' && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#00D2FF] rounded-full animate-ping" />
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 text-center">
          <p className="text-[10px] text-[#A2A2D0]/50">Client</p>
          <p className="text-xs text-white truncate">{escrow.client?.name}</p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#FF5E62] to-[#7B61FF]" />
          <span className="px-2 text-lg animate-[marquee_2s_ease-in-out_infinite_alternate]">💰</span>
          <div className="h-px flex-1 bg-gradient-to-r from-[#7B61FF] to-transparent" />
        </div>
        <div className="flex-1 text-center">
          <p className="text-[10px] text-[#A2A2D0]/50">Vault</p>
          <p className="text-xs text-[#00D2FF] font-bold">${escrow.lockedAmount}</p>
        </div>
      </div>

      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-3">
        <div
          className="h-full bg-gradient-to-r from-[#FF5E62] via-[#7B61FF] to-[#00D2FF] transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="space-y-2 mb-4">
        {escrow.milestones?.map((m, i) => (
          <div key={i} className="flex items-center justify-between text-xs">
            <span className={m.status === 'completed' ? 'text-emerald-400' : 'text-[#A2A2D0]/70'}>
              {m.status === 'completed' ? '✓' : '○'} {m.title}
            </span>
            <span className="text-white">${m.amount}</span>
          </div>
        ))}
      </div>

      {escrow.status === 'released' && (
        <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
          <p className="text-xs text-[#00D2FF] font-semibold">Contract Completed & Released 🎉</p>
          {submitted ? (
            <p className="text-xs text-emerald-400 font-medium">Thank you! Your review has been submitted.</p>
          ) : (
            <form onSubmit={handleReviewSubmit} className="space-y-3">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-[#A2A2D0]/60 mr-1">Rate Experience:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <svg
                      className={`w-4 h-4 transition-colors ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-white/20'}`}
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.969 0 1.371 1.24.588 1.81l-3.97 2.883a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.971-2.883a1 1 0 00-1.178 0l-3.97 2.883c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118l-3.97-2.883c-.783-.57-.38-1.81.588-1.81h4.908a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </button>
                ))}
              </div>
              <textarea
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-[#A2A2D0]/40 focus:outline-none focus:border-[#7B61FF]"
                placeholder="Write your feedback..."
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={2}
              />
              {error && <p className="text-red-400 text-[10px]">{error}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-white/10 hover:bg-white/15 text-white font-semibold py-1.5 rounded-lg text-xs transition-colors disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
