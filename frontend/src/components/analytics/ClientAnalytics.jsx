import { glassCard } from '../../styles/dashboardStyles';

export default function ClientAnalytics({ data }) {
  if (!data) return null;

  return (
    <div className={`${glassCard} p-5`}>
      <h3 className="text-white font-semibold mb-4">Client Analytics</h3>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          { label: 'Total Spent', value: `$${data.totalSpent}` },
          { label: 'Active Contracts', value: data.activeContracts },
          { label: 'Gigs Posted', value: data.gigsPosted },
          { label: 'Gigs Filled', value: data.gigsFilled },
        ].map((s) => (
          <div key={s.label} className="bg-white/5 rounded-xl p-3">
            <p className="text-[10px] text-[#A2A2D0]/50 uppercase">{s.label}</p>
            <p className="text-lg font-bold text-white">{s.value}</p>
          </div>
        ))}
      </div>
      {data.contractTimelines?.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-[#A2A2D0]/60">Active Contract Timelines</p>
          {data.contractTimelines.slice(0, 4).map((c) => (
            <div key={c.id} className="bg-white/5 rounded-lg p-2">
              <div className="flex justify-between text-xs text-white mb-1">
                <span>{c.status}</span>
                <span>{c.progress}%</span>
              </div>
              <div className="h-1 bg-white/10 rounded-full">
                <div className="h-full bg-gradient-to-r from-[#FF5E62] to-[#7B61FF] rounded-full" style={{ width: `${c.progress}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
