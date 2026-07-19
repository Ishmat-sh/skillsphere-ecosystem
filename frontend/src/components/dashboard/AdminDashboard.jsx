import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { glassCard, btnPrimary, btnGhost, statusBadge } from '../../styles/dashboardStyles';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [gigs, setGigs] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadStats = () => {
    api.get('/api/admin/stats')
      .then((res) => setStats(res.data))
      .catch(() => {});
  };

  const loadUsers = () => {
    setLoading(true);
    api.get('/api/admin/users')
      .then((res) => {
        setUsers(res.data.users || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to fetch users');
        setLoading(false);
      });
  };

  const loadGigs = () => {
    setLoading(true);
    api.get('/api/admin/gigs')
      .then((res) => {
        setGigs(res.data.gigs || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to fetch gigs');
        setLoading(false);
      });
  };

  const loadPayments = () => {
    setLoading(true);
    api.get('/api/admin/payments')
      .then((res) => {
        setPayments(res.data.payments || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to fetch payments');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    setError('');
    if (activeTab === 'users') {
      loadUsers();
    } else if (activeTab === 'gigs') {
      loadGigs();
    } else if (activeTab === 'payments') {
      loadPayments();
    }
  }, [activeTab]);

  const handleSuspend = async (userId) => {
    const reason = window.prompt('Enter suspension reason:');
    if (reason === null) return; // user cancelled
    try {
      await api.patch(`/api/admin/users/${userId}/suspend`, { reason: reason || 'Violation of policies' });
      loadUsers();
      loadStats();
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    }
  };

  const handleVerify = async (userId) => {
    try {
      await api.patch(`/api/admin/users/${userId}/verify`);
      alert('Freelancer verified successfully!');
      loadUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This cannot be undone.')) return;
    try {
      await api.delete(`/api/admin/users/${userId}`);
      loadUsers();
      loadStats();
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    }
  };

  const handleApproveGig = async (gigId) => {
    try {
      await api.patch(`/api/admin/gigs/${gigId}/approve`);
      loadGigs();
      loadStats();
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    }
  };

  const handleDeleteGig = async (gigId) => {
    if (!window.confirm('Are you sure you want to delete this gig?')) return;
    try {
      await api.delete(`/api/admin/gigs/${gigId}`);
      loadGigs();
      loadStats();
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    }
  };

  // Helper formatting values
  const totalRevenue = stats?.totalRevenue || 0;
  const clientCount = stats?.users?.find(u => u._id === 'Client')?.count || 0;
  const freelancerCount = stats?.users?.find(u => u._id === 'Freelancer')?.count || 0;
  const totalUsersCount = clientCount + freelancerCount;
  const activeGigsCount = stats?.gigs?.find(g => g._id === 'active')?.count || 0;
  const filledGigsCount = stats?.gigs?.find(g => g._id === 'filled')?.count || 0;
  const totalGigsCount = activeGigsCount + filledGigsCount;

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`${glassCard} p-4 text-center`}>
          <p className="text-[#A2A2D0]/60 text-xs uppercase tracking-wider">Total Revenue</p>
          <h4 className="text-2xl font-bold bg-gradient-to-r from-[#FF5E62] to-[#00D2FF] bg-clip-text text-transparent mt-1">
            ${totalRevenue.toLocaleString()}
          </h4>
        </div>
        <div className={`${glassCard} p-4 text-center`}>
          <p className="text-[#A2A2D0]/60 text-xs uppercase tracking-wider">Total Registered Users</p>
          <h4 className="text-2xl font-bold text-white mt-1">{totalUsersCount}</h4>
        </div>
        <div className={`${glassCard} p-4 text-center`}>
          <p className="text-[#A2A2D0]/60 text-xs uppercase tracking-wider">Gigs Posted</p>
          <h4 className="text-2xl font-bold text-white mt-1">{totalGigsCount}</h4>
        </div>
        <div className={`${glassCard} p-4 text-center`}>
          <p className="text-[#A2A2D0]/60 text-xs uppercase tracking-wider">Proposals Submitted</p>
          <h4 className="text-2xl font-bold text-white mt-1">
            {stats?.proposals?.reduce((sum, p) => sum + p.count, 0) || 0}
          </h4>
        </div>
      </div>

      {/* Tabs Control */}
      <div className="flex border-b border-white/10 gap-2">
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-2.5 px-4 text-sm font-semibold tracking-wide border-b-2 transition-colors ${activeTab === 'users' ? 'border-[#7B61FF] text-white' : 'border-transparent text-[#A2A2D0]/50 hover:text-white'}`}
        >
          Manage Users
        </button>
        <button
          onClick={() => setActiveTab('gigs')}
          className={`pb-2.5 px-4 text-sm font-semibold tracking-wide border-b-2 transition-colors ${activeTab === 'gigs' ? 'border-[#7B61FF] text-white' : 'border-transparent text-[#A2A2D0]/50 hover:text-white'}`}
        >
          Manage Gigs
        </button>
        <button
          onClick={() => setActiveTab('payments')}
          className={`pb-2.5 px-4 text-sm font-semibold tracking-wide border-b-2 transition-colors ${activeTab === 'payments' ? 'border-[#7B61FF] text-white' : 'border-transparent text-[#A2A2D0]/50 hover:text-white'}`}
        >
          Payment Vaults
        </button>
      </div>

      {/* Table Card */}
      <div className={`${glassCard} p-6`}>
        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        {loading ? (
          <p className="text-[#A2A2D0]/50 text-sm text-center py-12">Loading data...</p>
        ) : (
          <div className="overflow-x-auto">
            {activeTab === 'users' && (
              <table className="w-full text-left text-sm text-[#A2A2D0]/80">
                <thead>
                  <tr className="border-b border-white/10 text-[#A2A2D0]/40 uppercase tracking-wider text-xs">
                    <th className="pb-3">Name</th>
                    <th className="pb-3">Email</th>
                    <th className="pb-3">Role</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-white/[0.02]">
                      <td className="py-4 text-white font-medium">{u.name}</td>
                      <td className="py-4">{u.email}</td>
                      <td className="py-4 font-semibold text-xs text-[#00D2FF]">{u.role}</td>
                      <td className="py-4">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${u.isSuspended ? 'bg-red-500/20 text-red-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                          {u.isSuspended ? 'Suspended' : 'Active'}
                        </span>
                      </td>
                      <td className="py-4 text-right space-x-2">
                        {u.role === 'Freelancer' && (
                          <button onClick={() => handleVerify(u._id)} className="text-xs text-amber-400 hover:underline">
                            Verify Freelancer
                          </button>
                        )}
                        {!u.isSuspended ? (
                          <button onClick={() => handleSuspend(u._id)} className="text-xs text-red-400 hover:underline">
                            Suspend
                          </button>
                        ) : (
                          <span className="text-xs text-red-400/40">Suspended</span>
                        )}
                        <button onClick={() => handleDeleteUser(u._id)} className="text-xs text-white/50 hover:text-white hover:underline">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center py-8 text-[#A2A2D0]/30">No users registered on platform</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

            {activeTab === 'gigs' && (
              <table className="w-full text-left text-sm text-[#A2A2D0]/80">
                <thead>
                  <tr className="border-b border-white/10 text-[#A2A2D0]/40 uppercase tracking-wider text-xs">
                    <th className="pb-3">Title</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3">Client Email</th>
                    <th className="pb-3">Budget</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {gigs.map((g) => (
                    <tr key={g._id} className="hover:bg-white/[0.02]">
                      <td className="py-4 text-white font-medium">{g.title}</td>
                      <td className="py-4">{g.category}</td>
                      <td className="py-4">{g.client?.email || 'N/A'}</td>
                      <td className="py-4 font-bold text-white">${g.budget}</td>
                      <td className="py-4">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${statusBadge(g.status)}`}>
                          {g.status}
                        </span>
                      </td>
                      <td className="py-4 text-right space-x-2">
                        {g.status === 'active' && !g.isApproved && (
                          <button onClick={() => handleApproveGig(g._id)} className="text-xs text-emerald-400 hover:underline">
                            Approve
                          </button>
                        )}
                        <button onClick={() => handleDeleteGig(g._id)} className="text-xs text-red-400 hover:underline">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {gigs.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center py-8 text-[#A2A2D0]/30">No gigs posted on platform</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

            {activeTab === 'payments' && (
              <table className="w-full text-left text-sm text-[#A2A2D0]/80">
                <thead>
                  <tr className="border-b border-white/10 text-[#A2A2D0]/40 uppercase tracking-wider text-xs">
                    <th className="pb-3">Contract Gig</th>
                    <th className="pb-3">Client</th>
                    <th className="pb-3">Freelancer</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Released</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {payments.map((p) => (
                    <tr key={p._id} className="hover:bg-white/[0.02]">
                      <td className="py-4 text-white font-medium">{p.gig?.title || 'Contract'}</td>
                      <td className="py-4">{p.client?.name}</td>
                      <td className="py-4">{p.freelancer?.name}</td>
                      <td className="py-4 font-bold text-white">${p.totalAmount}</td>
                      <td className="py-4 text-emerald-400">${p.releasedAmount}</td>
                      <td className="py-4">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${statusBadge(p.status)}`}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {payments.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center py-8 text-[#A2A2D0]/30">No active escrow transactions</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
