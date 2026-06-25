const NODES = [
  { x: 50, y: 28, color: '#FF5E62', size: 7 },
  { x: 78, y: 38, color: '#00D2FF', size: 6 },
  { x: 22, y: 42, color: '#7B61FF', size: 5 },
  { x: 68, y: 62, color: '#E94E77', size: 6 },
  { x: 32, y: 68, color: '#FF8A65', size: 5 },
  { x: 82, y: 58, color: '#FF00FF', size: 5 },
  { x: 18, y: 58, color: '#00D2FF', size: 4 },
];

const CONNECTIONS = [
  [0, 1], [0, 2], [0, 3], [0, 4], [1, 3], [2, 4], [2, 6], [3, 5], [4, 6], [1, 5],
];

export default function AuthHeroPanel() {
  return (
    <div className="hidden lg:flex lg:w-[48%] h-dvh relative bg-[#1a1218] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-white/[0.04]" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[280px] h-[280px] rounded-full border border-white/[0.04]" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#FF00FF]/8 rounded-full blur-3xl" />
        <div className="absolute top-10 right-10 w-56 h-56 bg-[#00D2FF]/8 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex w-full h-full px-6 xl:px-10 py-6">
        <div className="flex flex-col justify-between w-[45%] pr-4 shrink-0">
          <div>
            <p className="text-[#A2A2D0]/60 text-[10px] uppercase tracking-[0.18em] font-medium mb-2">
              Intelligent Hyperlocal Freelance Ecosystem
            </p>
            <p className="text-[#A2A2D0]/70 text-xs leading-relaxed">
              Verified talent in your neighbourhood — matched by skill, proximity, and trust.
            </p>
          </div>

          <div>
            <h1 className="text-2xl xl:text-[1.75rem] font-bold text-white leading-tight mb-6">
              Talent that lives{' '}
              <span className="bg-gradient-to-r from-[#FF5E62] via-[#7B61FF] to-[#00D2FF] bg-clip-text text-transparent">
                where you do.
              </span>
            </h1>

            <div className="flex gap-2">
              {[
                { value: '12K+', label: 'Freelancers' },
                { value: '3.2K', label: 'Projects' },
                { value: '40+', label: 'Skills' },
              ].map((stat) => (
                <div key={stat.label} className="flex-1 bg-white/[0.04] border border-white/[0.06] rounded-lg px-2 py-2 text-center">
                  <div className="text-sm font-bold text-white">{stat.value}</div>
                  <div className="text-[9px] text-[#A2A2D0]/50 leading-tight">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center relative min-w-0">
          <div className="relative w-full max-w-[280px] aspect-square">
            <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
              <defs>
                <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#7B61FF" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#7B61FF" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FF5E62" stopOpacity="0.5" />
                  <stop offset="50%" stopColor="#7B61FF" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#00D2FF" stopOpacity="0.5" />
                </linearGradient>
                <filter id="nodeGlow">
                  <feGaussianBlur stdDeviation="0.8" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <circle cx="50" cy="50" r="38" fill="url(#hubGlow)" />
              <circle cx="50" cy="50" r="28" fill="none" stroke="white" strokeOpacity="0.04" strokeWidth="0.3" strokeDasharray="2 3" />

              {CONNECTIONS.map(([a, b], i) => (
                <line key={i} x1={NODES[a].x} y1={NODES[a].y} x2={NODES[b].x} y2={NODES[b].y} stroke="url(#lineGrad)" strokeWidth="0.25" strokeOpacity="0.7" />
              ))}
              {CONNECTIONS.slice(0, 6).map(([a], i) => (
                <line key={`hub-${i}`} x1="50" y1="50" x2={NODES[a].x} y2={NODES[a].y} stroke="url(#lineGrad)" strokeWidth="0.2" strokeOpacity="0.5" />
              ))}

              <circle cx="50" cy="50" r="5" fill="#1a1218" stroke="url(#lineGrad)" strokeWidth="0.6" filter="url(#nodeGlow)" />
              <circle cx="50" cy="50" r="2.5" fill="#7B61FF" opacity="0.9" />

              {NODES.map((node, i) => (
                <g key={i}>
                  <circle cx={node.x} cy={node.y} r={node.size + 2} fill={node.color} opacity="0.12" />
                  <circle cx={node.x} cy={node.y} r={node.size / 2} fill={node.color} filter="url(#nodeGlow)" />
                </g>
              ))}
            </svg>

            <div className="absolute -top-1 right-0 bg-white/[0.06] backdrop-blur-md border border-white/[0.08] rounded-xl px-3 py-2 shadow-xl">
              <div className="flex items-center gap-1.5 mb-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00D2FF] animate-pulse" />
                <span className="text-[9px] text-[#A2A2D0]/60 uppercase tracking-wider">Live matches</span>
              </div>
              <div className="text-base font-bold text-white leading-none">847</div>
              <div className="text-[9px] text-[#00D2FF]">within 5 km</div>
            </div>

            <div className="absolute bottom-2 left-0 bg-white/[0.06] backdrop-blur-md border border-white/[0.08] rounded-xl px-3 py-2 shadow-xl">
              <div className="text-[9px] text-[#A2A2D0]/60 uppercase tracking-wider mb-0.5">Match accuracy</div>
              <div className="flex items-end gap-0.5">
                <span className="text-base font-bold text-white leading-none">98</span>
                <span className="text-xs text-[#FF5E62] font-semibold">%</span>
              </div>
            </div>

            <div className="absolute bottom-14 right-0 bg-white/[0.06] backdrop-blur-md border border-white/[0.08] rounded-lg px-2.5 py-1.5 shadow-lg">
              <div className="flex items-center gap-1.5">
                <svg className="w-3 h-3 text-[#FF5E62]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
                </svg>
                <span className="text-[10px] text-white/80 font-medium">2.4 km avg</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
