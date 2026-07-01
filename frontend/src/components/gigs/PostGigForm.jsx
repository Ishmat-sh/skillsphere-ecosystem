import { useState } from 'react';
import api from '../../services/api';
import { inputClass, btnPrimary, glassCard } from '../../styles/dashboardStyles';

export default function PostGigForm({ onCreated }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    budget: '',
    category: 'Development',
    skills: '',
    deadline: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/api/gigs', {
        ...form,
        budget: Number(form.budget),
        skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
      });
      onCreated?.(res.data);
      setForm({ title: '', description: '', budget: '', category: 'Development', skills: '', deadline: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post gig');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${glassCard} p-5`}>
      <h3 className="text-white font-semibold mb-4">Post a Gig</h3>
      {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input className={inputClass} placeholder="Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <textarea className={`${inputClass} min-h-[80px] resize-none`} placeholder="Description" required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <div className="grid grid-cols-2 gap-3">
          <input className={inputClass} type="number" placeholder="Budget ($)" required value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} />
          <select className={inputClass} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {['Development', 'Design', 'Marketing', 'Writing', 'Data'].map((c) => (
              <option key={c} value={c} className="bg-[#1a1218]">{c}</option>
            ))}
          </select>
        </div>
        <input className={inputClass} placeholder="Skills (comma separated)" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
        <input className={inputClass} type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
        <button type="submit" disabled={loading} className={`${btnPrimary} w-full disabled:opacity-50`}>
          {loading ? 'Posting...' : 'Publish Gig'}
        </button>
      </form>
    </div>
  );
}
