import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import useSocket from '../hooks/useSocket';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import PostGigForm from '../components/gigs/PostGigForm';
import GigFeed from '../components/gigs/GigFeed';
import ClientProposals from '../components/proposals/ClientProposals';
import TimelineLock from '../components/escrow/TimelineLock';
import FreelancerAnalytics from '../components/analytics/FreelancerAnalytics';
import ClientAnalytics from '../components/analytics/ClientAnalytics';
import ChatPanel from '../components/chat/ChatPanel';
import { btnPrimary } from '../styles/dashboardStyles';

export default function Dashboard() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [escrows, setEscrows] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [newEscrow, setNewEscrow] = useState(null);
  const [gigSearch, setGigSearch] = useState(searchParams.get('search') || '');

  const loadEscrows = () => api.get('/api/escrow/mine').then((res) => setEscrows(res.data)).catch(() => {});

  const onProposalUpdate = useCallback(() => setRefreshKey((k) => k + 1), []);
  const onContractUpdate = useCallback((payload) => {
    setEscrows((prev) => {
      const idx = prev.findIndex((e) => e._id === payload.escrow?._id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = payload.escrow;
        return next;
      }
      return [payload.escrow, ...prev];
    });
  }, []);

  const socketHook = useSocket(onProposalUpdate, onContractUpdate);

  useEffect(() => {
    loadEscrows();
    const endpoint = user?.role === 'Client' ? '/api/analytics/client' : '/api/analytics/freelancer';
    api.get(endpoint).then((res) => setAnalytics(res.data)).catch(() => {});
  }, [user?.role, refreshKey]);

  const completeMilestone = async (escrowId, index) => {
    const res = await api.patch(`/api/escrow/${escrowId}/milestone/${index}/complete`);
    setEscrows((prev) => prev.map((e) => (e._id === escrowId ? res.data : e)));
  };

  const isClient = user?.role === 'Client';

  return (
    <DashboardLayout>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          {isClient ? (
            <>
              <PostGigForm onCreated={() => setRefreshKey((k) => k + 1)} />
              <ClientProposals
                refreshKey={refreshKey}
                onHired={(escrow) => {
                  setNewEscrow(escrow);
                  loadEscrows();
                  setTimeout(() => setNewEscrow(null), 3000);
                }}
              />
            </>
          ) : (
            <>
              <div className="flex gap-2">
                <input
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm placeholder-[#A2A2D0]/40"
                  placeholder="Search gigs (e.g. javascript)"
                  value={gigSearch}
                  onChange={(e) => setGigSearch(e.target.value)}
                />
              </div>
              <GigFeed searchQuery={gigSearch} />
            </>
          )}

          {escrows.map((escrow) => (
            <div key={escrow._id}>
              <TimelineLock escrow={escrow} animate={newEscrow?._id === escrow._id} />
              <div className="mt-2 flex flex-wrap gap-2">
                {escrow.milestones?.map((m, i) =>
                  m.status === 'pending' ? (
                    <button key={i} className={btnPrimary} onClick={() => completeMilestone(escrow._id, i)}>
                      Complete: {m.title}
                    </button>
                  ) : null
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          {isClient ? <ClientAnalytics data={analytics} /> : <FreelancerAnalytics data={analytics} />}
          <ChatPanel socketHook={socketHook} />
        </div>
      </div>
    </DashboardLayout>
  );
}
