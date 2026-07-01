import { useEffect, useState } from 'react';
import api from '../../services/api';
import { glassCard, statusBadge, btnPrimary, btnGhost } from '../../styles/dashboardStyles';

export default function ClientProposals({ refreshKey, onHired }) {
  const [gigs, setGigs] = useState([]);
  const [selectedGig, setSelectedGig] = useState(null);
  const [proposals, setProposals] = useState([]);

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

  return (
    <div className={`${glassCard} p-5`}>
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
            <div className="flex justify-between mb-2">
              <span className="text-white text-sm font-medium">{p.freelancer?.name}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${statusBadge(p.status)}`}>{p.status}</span>
            </div>
            <p className="text-xs text-[#A2A2D0]/70 mb-1">Quote: <span className="text-[#00D2FF]">${p.quote}</span> · {p.deliveryTimeline}</p>
            <p className="text-xs text-[#A2A2D0]/50 mb-3">{p.coverLetter}</p>
            {p.status === 'Pending' && (
              <div className="flex gap-2">
                <button className={`${btnPrimary} flex-1`} onClick={() => hire(p._id)}>Hire & Lock Escrow</button>
                <button className={`${btnGhost} flex-1`} onClick={() => updateStatus(p._id, 'Rejected')}>Reject</button>
              </div>
            )}
          </div>
        ))}
        {selectedGig && proposals.length === 0 && (
          <p className="text-[#A2A2D0]/50 text-sm text-center py-6">No proposals yet</p>
        )}
      </div>
    </div>
  );
}
