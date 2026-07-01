export const glassCard =
  'rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-xl shadow-[0_8px_32px_rgba(123,97,255,0.1)]';

export const inputClass =
  'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-[#A2A2D0]/40 focus:outline-none focus:border-[#00D2FF]/50 text-sm';

export const btnPrimary =
  'bg-gradient-to-r from-[#FF5E62] via-[#7B61FF] to-[#E94E77] text-white font-semibold py-2.5 px-5 rounded-xl hover:opacity-90 transition-opacity text-sm';

export const btnGhost =
  'border border-white/10 text-[#A2A2D0] py-2 px-4 rounded-xl hover:bg-white/5 transition-colors text-sm';

export const statusBadge = (status) => {
  const map = {
    Pending: 'bg-yellow-500/20 text-yellow-300',
    Accepted: 'bg-emerald-500/20 text-emerald-300',
    Rejected: 'bg-red-500/20 text-red-300',
    active: 'bg-[#00D2FF]/20 text-[#00D2FF]',
    filled: 'bg-[#7B61FF]/20 text-[#A2A2D0]',
    locked: 'bg-orange-500/20 text-orange-300',
    partial: 'bg-yellow-500/20 text-yellow-300',
    released: 'bg-emerald-500/20 text-emerald-300',
  };
  return map[status] || 'bg-white/10 text-white';
};
