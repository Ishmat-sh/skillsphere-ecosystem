import { useEffect, useState } from 'react';
import api from '../../services/api';
import { glassCard, statusBadge, btnPrimary, btnGhost } from '../../styles/dashboardStyles';

export default function ClientProposals({ refreshKey, onHired }) {
  const [gigs, setGigs] = useState([]);
  const [selectedGig, setSelectedGig] = useState(null);
  const [proposals, setProposals] = useState([]);

  // Mock payment gateway states
  const [checkoutProposal, setCheckoutProposal] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('Stripe');
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('123');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    api.get('/api/gigs/mine').then((res) => setGigs(res.data)).catch(() => {});
  }, [refreshKey]);

  useEffect(() => {
    if (!selectedGig) return;
    api.get(`/api/proposals/gig/${selectedGig}`).then((res) => setProposals(res.data)).catch(() => {});
  }, [selectedGig, refreshKey]);

  const updateStatus = async (id, status) => {
    await api.patch(`/api/proposals/${id}/status`, { status });
    setProposals((p) => p.map((x) => (x._id === id ? { ...x, status } : x)));
  };

  const hire = async (id) => {
    const res = await api.post(`/api/proposals/${id}/hire`);
    onHired?.(res.data);
    setProposals((p) => p.map((x) => (x._id === id ? { ...x, status: 'Accepted' } : { ...x, status: 'Rejected' })));
  };

  const handleConfirmPayment = async () => {
    setIsProcessingPayment(true);
    try {
      await hire(checkoutProposal._id);
      setCheckoutProposal(null);
    } catch (err) {
      alert('Payment processing failed');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Freelancer availability viewer states
  const [viewAvailabilityFreelancer, setViewAvailabilityFreelancer] = useState(null);
  const [freelancerAvailability, setFreelancerAvailability] = useState([]);
  const [loadingAvailability, setLoadingAvailability] = useState(false);

  useEffect(() => {
    if (!viewAvailabilityFreelancer) return;
    setLoadingAvailability(true);
    api.get(`/api/freelancer/availability/user/${viewAvailabilityFreelancer._id}`)
      .then((res) => {
        setFreelancerAvailability(res.data || []);
        setLoadingAvailability(false);
      })
      .catch(() => {
        setFreelancerAvailability([]);
        setLoadingAvailability(false);
      });
  }, [viewAvailabilityFreelancer]);

  return (
    <div className={`${glassCard} p-5 relative`}>
      <h3 className="text-white font-semibold mb-4">Proposal Pipeline</h3>
      <div className="flex flex-wrap gap-2 mb-4">
        {gigs.map((g) => (
          <button key={g._id} className={`${selectedGig === g._id ? btnPrimary : btnGhost}`} onClick={() => setSelectedGig(g._id)}>
            {g.title}
          </button>
        ))}
      </div>
      <div className="space-y-3 max-h-[360px] overflow-y-auto">
        {proposals.map((p) => (
          <div key={p._id} className="bg-white/5 rounded-xl p-4 border border-white/5">
            <div className="flex justify-between mb-2 items-center">
              <span className="text-white text-sm font-medium">{p.freelancer?.name}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewAvailabilityFreelancer(p.freelancer)}
                  className="text-[10px] text-[#00D2FF] hover:underline"
                >
                  📅 View Schedule
                </button>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${statusBadge(p.status)}`}>{p.status}</span>
              </div>
            </div>
            <p className="text-xs text-[#A2A2D0]/70 mb-1">Quote: <span className="text-[#00D2FF]">${p.quote}</span> · {p.deliveryTimeline}</p>
            <p className="text-xs text-[#A2A2D0]/50 mb-3">{p.coverLetter}</p>
            {p.status === 'Pending' && (
              <div className="flex gap-2">
                <button className={`${btnPrimary} flex-1`} onClick={() => setCheckoutProposal(p)}>Hire & Lock Escrow</button>
                <button className={`${btnGhost} flex-1`} onClick={() => updateStatus(p._id, 'Rejected')}>Reject</button>
              </div>
            )}
          </div>
        ))}
        {selectedGig && proposals.length === 0 && (
          <p className="text-[#A2A2D0]/50 text-sm text-center py-6">No proposals yet</p>
        )}
      </div>

      {/* Stripe / Razorpay Checkout Modal Overlay */}
      {checkoutProposal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#13131a] border border-white/10 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl relative text-left">
            <h4 className="text-white font-bold text-lg flex items-center gap-2">
              <span>💳 Secure Escrow Payment</span>
            </h4>
            <p className="text-xs text-[#A2A2D0]/70">
              Funding escrow vault for proposal from <span className="text-white font-semibold">{checkoutProposal.freelancer?.name}</span>
            </p>
            
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('Stripe')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${paymentMethod === 'Stripe' ? 'border-[#00D2FF] bg-[#00D2FF]/10 text-[#00D2FF]' : 'border-white/10 text-white/50'}`}
              >
                Stripe
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('Razorpay')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${paymentMethod === 'Razorpay' ? 'border-[#7B61FF] bg-[#7B61FF]/10 text-[#7B61FF]' : 'border-white/10 text-white/50'}`}
              >
                Razorpay
              </button>
            </div>

            <div className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/5 text-xs text-[#A2A2D0]/60">
              <div className="flex justify-between font-medium">
                <span>Milestone Bid Quote:</span>
                <span className="text-white">${checkoutProposal.quote}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Processing Fee (0%):</span>
                <span className="text-white">$0</span>
              </div>
              <div className="h-px bg-white/10" />
              <div className="flex justify-between font-bold text-white text-sm">
                <span>Total Amount:</span>
                <span className="text-[#00D2FF]">${checkoutProposal.quote}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <label className="text-[10px] text-[#A2A2D0]/50 block mb-1">Card Number</label>
                <input
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-[#A2A2D0]/50 block mb-1">Expiry Date</label>
                  <input
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#A2A2D0]/50 block mb-1">CVC</label>
                  <input
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
                    placeholder="123"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setCheckoutProposal(null)}
                className="flex-1 bg-white/5 hover:bg-white/10 text-white font-semibold py-2 rounded-xl text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleConfirmPayment()}
                disabled={isProcessingPayment}
                className="flex-1 bg-gradient-to-r from-[#FF5E62] via-[#7B61FF] to-[#E94E77] text-white font-semibold py-2 rounded-xl text-xs hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isProcessingPayment ? 'Processing...' : `Pay $${checkoutProposal.quote}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Availability Schedule Booking Modal */}
      {viewAvailabilityFreelancer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#13131a] border border-white/10 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl relative text-left">
            <h4 className="text-white font-bold text-lg flex items-center gap-2">
              <span>📅 {viewAvailabilityFreelancer.name}'s Availability</span>
            </h4>
            <p className="text-xs text-[#A2A2D0]/70">
              Select an available weekly slot to book an introductory briefing or project meeting.
            </p>

            {loadingAvailability ? (
              <p className="text-xs text-[#A2A2D0]/50 text-center py-6">Loading availability slots...</p>
            ) : freelancerAvailability.length === 0 ? (
              <p className="text-xs text-[#A2A2D0]/50 text-center py-6">No availability slots configured by freelancer yet.</p>
            ) : (
              <div className="space-y-3 max-h-[240px] overflow-y-auto pr-1">
                {freelancerAvailability.map((avail) => (
                  <div key={avail.day} className="border-b border-white/5 pb-2.5 last:border-b-0">
                    <p className="text-xs font-semibold text-white mb-1.5">{avail.day}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {avail.slots.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => {
                            alert(`Introductory briefing booked for ${avail.day} at ${slot}! Automatic calendar invite sent.`);
                            setViewAvailabilityFreelancer(null);
                          }}
                          className="text-[10px] px-2.5 py-1 bg-[#7B61FF]/10 border border-[#7B61FF]/30 text-white rounded-lg hover:bg-[#7B61FF]/20 transition-colors"
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={() => setViewAvailabilityFreelancer(null)}
              className="w-full bg-white/5 hover:bg-white/10 text-white font-semibold py-2 rounded-xl text-xs transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
