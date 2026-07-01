export default function TimelineLock({ escrow, animate = false }) {
  if (!escrow) return null;

  const progress = Math.round((escrow.releasedAmount / escrow.totalAmount) * 100);

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

      <div className="space-y-2">
        {escrow.milestones?.map((m, i) => (
          <div key={i} className="flex items-center justify-between text-xs">
            <span className={m.status === 'completed' ? 'text-emerald-400' : 'text-[#A2A2D0]/70'}>
              {m.status === 'completed' ? '✓' : '○'} {m.title}
            </span>
            <span className="text-white">${m.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
