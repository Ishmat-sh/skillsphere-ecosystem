import { glassCard } from '../../styles/dashboardStyles';

export default function FreelancerAnalytics({ data }) {
  if (!data) return null;

  const months = Object.entries(data.monthlyEarnings || {});

  return (
    <div className={`${glassCard} p-5`}>
      <h3 className="text-white font-semibold mb-4">Freelancer Analytics</h3>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          { label: 'Total Earnings', value: `$${data.totalEarnings}`, color: 'text-[#00D2FF]' },
          { label: 'Pending Clearances', value: `$${data.pendingClearances}`, color: 'text-orange-300' },
          { label: 'Completion Rate', value: `${data.completionRate}%`, color: 'text-emerald-400' },
          { label: 'Proposals Accepted', value: data.proposalsAccepted, color: 'text-[#A2A2D0]' },
        ].map((s) => (
          <div key={s.label} className="bg-white/5 rounded-xl p-3">
            <p className="text-[10px] text-[#A2A2D0]/50 uppercase">{s.label}</p>
            <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>
      {months.length > 0 && (
        <div>
          <p className="text-xs text-[#A2A2D0]/60 mb-2">Monthly Earnings</p>
          <div className="flex items-end gap-2 h-20">
            {months.map(([month, amount]) => (
              <div key={month} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-gradient-to-t from-[#7B61FF] to-[#00D2FF] rounded-t"
                  style={{ height: `${Math.min(100, (amount / Math.max(...months.map(([, a]) => a))) * 100)}%`, minHeight: 4 }}
                />
                <span className="text-[9px] text-[#A2A2D0]/50">{month}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
