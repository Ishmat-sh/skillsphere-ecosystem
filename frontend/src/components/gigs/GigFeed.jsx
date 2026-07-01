import { useEffect, useState } from 'react';
import api from '../../services/api';
import { glassCard, statusBadge, btnPrimary, btnGhost, inputClass } from '../../styles/dashboardStyles';

export default function GigFeed({ onSelectGig, searchQuery = '' }) {
  const [gigs, setGigs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [proposal, setProposal] = useState({ quote: '', deliveryTimeline: '', coverLetter: '' });
  const [msg, setMsg] = useState('');

  const load = () => {
    const params = searchQuery ? { search: searchQuery } : {};
    api.get('/api/gigs', { params }).then((res) => setGigs(res.data)).catch(() => {});
  };

  useEffect(() => { load(); }, [searchQuery]);

  const submitProposal = async (gigId) => {
    try {
      await api.post(`/api/proposals/gig/${gigId}`, proposal);
      setMsg('Proposal submitted!');
      setSelected(null);
      setProposal({ quote: '', deliveryTimeline: '', coverLetter: '' });
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed');
    }
  };

  return (
    <div className={`${glassCard} p-5`}>
      <h3 className="text-white font-semibold mb-4">Live Project Feed</h3>
      {msg && <p className="text-[#00D2FF] text-sm mb-3">{msg}</p>}
      <div className="space-y-3 max-h-[420px] overflow-y-auto">
        {gigs.map((gig) => (
          <div key={gig._id} className="bg-white/5 border border-white/5 rounded-xl p-4">
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-white font-medium">{gig.title}</h4>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${statusBadge(gig.status)}`}>{gig.status}</span>
            </div>
            <p className="text-xs text-[#A2A2D0]/70 mb-2 line-clamp-2">{gig.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-[#00D2FF] font-bold">${gig.budget}</span>
              <button className={btnGhost} onClick={() => { setSelected(gig._id); onSelectGig?.(gig); }}>
                Apply
              </button>
            </div>
            {selected === gig._id && (
              <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                <input className={inputClass} type="number" placeholder="Your quote ($)" value={proposal.quote} onChange={(e) => setProposal({ ...proposal, quote: e.target.value })} />
                <input className={inputClass} placeholder="Delivery timeline (e.g. 2 weeks)" value={proposal.deliveryTimeline} onChange={(e) => setProposal({ ...proposal, deliveryTimeline: e.target.value })} />
                <textarea className={`${inputClass} min-h-[60px]`} placeholder="Cover letter" value={proposal.coverLetter} onChange={(e) => setProposal({ ...proposal, coverLetter: e.target.value })} />
                <button className={`${btnPrimary} w-full`} onClick={() => submitProposal(gig._id)}>Submit Proposal</button>
              </div>
            )}
          </div>
        ))}
        {gigs.length === 0 && <p className="text-[#A2A2D0]/50 text-sm text-center py-8">No active gigs yet</p>}
      </div>
    </div>
  );
}
