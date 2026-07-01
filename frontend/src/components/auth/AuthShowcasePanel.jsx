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

const TESTIMONIALS = [
  { name: 'Priya S.', role: 'UI Designer', quote: 'Found my first local client within 2 km — SkillSphere just gets hyperlocal.' },
  { name: 'Marcus T.', role: 'Startup Founder', quote: 'We hired three freelancers in our neighbourhood in under 48 hours.' },
  { name: 'Ananya R.', role: 'Full-Stack Dev', quote: 'The match accuracy is unreal. Every project feels like the right fit.' },
  { name: 'James L.', role: 'Marketing Lead', quote: 'Finally a platform that connects talent where we actually live and work.' },
];

export default function AuthShowcasePanel() {
  return (
    <div className="hidden lg:flex lg:w-1/2 h-dvh relative bg-[#1a1218] overflow-hidden flex-col items-center justify-center px-8 xl:px-12">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full border border-white/[0.04]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border border-white/[0.04]" />
      </div>

      <div className="relative z-10 text-center mb-6 shrink-0">
        <p className="text-[#A2A2D0]/60 text-[10px] uppercase tracking-[0.18em] font-medium mb-2">
          Intelligent Hyperlocal Freelance Ecosystem
        </p>
        <h2 className="text-2xl xl:text-3xl font-bold text-white leading-tight max-w-md mx-auto">
          Talent that lives{' '}
          <span className="bg-gradient-to-r from-[#FF5E62] via-[#7B61FF] to-[#00D2FF] bg-clip-text text-transparent">
            where you do.
          </span>
        </h2>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center flex-1 min-h-0 w-full max-w-md">
        <div className="relative w-32 h-32 mx-auto mb-5">
          <div className="absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-r from-[#FF5E62] to-[#FF8A65] animate-[spin_10s_linear_infinite] opacity-70" style={{ mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', maskComposite: 'exclude', WebkitMaskComposite: 'xor', padding: '2px' }} />
          <div className="absolute inset-3 rounded-full border-2 border-[#7B61FF]/50 animate-[spin_14s_linear_infinite_reverse]" />
          <div className="absolute inset-6 rounded-full border-2 border-[#00D2FF]/40 animate-[spin_8s_linear_infinite]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-white shadow-[0_0_16px_#7B61FF]" />
          </div>
        </div>

        <div className="relative w-full max-w-[260px] aspect-square mx-auto mb-5">
          <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
            <defs>
              <radialGradient id="showcaseHubGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#7B61FF" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#7B61FF" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="showcaseLineGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FF5E62" stopOpacity="0.5" />
                <stop offset="50%" stopColor="#7B61FF" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#00D2FF" stopOpacity="0.5" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="38" fill="url(#showcaseHubGlow)" />
            {CONNECTIONS.map(([a, b], i) => (
              <line key={i} x1={NODES[a].x} y1={NODES[a].y} x2={NODES[b].x} y2={NODES[b].y} stroke="url(#showcaseLineGrad)" strokeWidth="0.25" strokeOpacity="0.7" />
            ))}
            {CONNECTIONS.slice(0, 6).map(([a], i) => (
              <line key={`hub-${i}`} x1="50" y1="50" x2={NODES[a].x} y2={NODES[a].y} stroke="url(#showcaseLineGrad)" strokeWidth="0.2" strokeOpacity="0.5" />
            ))}
            <circle cx="50" cy="50" r="3" fill="#7B61FF" />
            {NODES.map((node, i) => (
              <circle key={i} cx={node.x} cy={node.y} r={node.size / 2.5} fill={node.color} opacity="0.9" />
            ))}
          </svg>

          <div className="absolute -top-1 left-1/2 -translate-x-1/2 bg-white/[0.06] backdrop-blur-md border border-white/[0.08] rounded-xl px-3 py-2 shadow-xl whitespace-nowrap">
            <div className="flex items-center justify-center gap-1.5 mb-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00D2FF] animate-pulse" />
              <span className="text-[9px] text-[#A2A2D0]/60 uppercase tracking-wider">Live matches</span>
            </div>
            <div className="text-base font-bold text-white leading-none text-center">847</div>
            <div className="text-[9px] text-[#00D2FF] text-center">within 5 km</div>
          </div>

          <div className="absolute bottom-0 left-0 bg-white/[0.06] backdrop-blur-md border border-white/[0.08] rounded-xl px-3 py-2 shadow-xl">
            <div className="text-[9px] text-[#A2A2D0]/60 uppercase tracking-wider mb-0.5">Match accuracy</div>
            <div className="flex items-end gap-0.5">
              <span className="text-base font-bold text-white leading-none">98</span>
              <span className="text-xs text-[#FF5E62] font-semibold">%</span>
            </div>
          </div>

          <div className="absolute bottom-0 right-0 bg-white/[0.06] backdrop-blur-md border border-white/[0.08] rounded-lg px-2.5 py-1.5 shadow-lg">
            <div className="flex items-center gap-1">
              <svg className="w-3 h-3 text-[#FF5E62]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
              </svg>
              <span className="text-[10px] text-white/80 font-medium">2.4 km avg</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 w-full max-w-[260px] mb-6">
          {[
            { value: '12K+', label: 'Freelancers' },
            { value: '3.2K', label: 'Projects' },
            { value: '40+', label: 'Skills' },
          ].map((stat) => (
            <div key={stat.label} className="flex-1 bg-white/[0.04] border border-white/[0.06] rounded-lg px-2 py-2 text-center">
              <div className="text-sm font-bold text-white">{stat.value}</div>
              <div className="text-[9px] text-[#A2A2D0]/50">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 w-full max-w-lg overflow-hidden shrink-0 pb-6">
        <div className="flex animate-[marquee_28s_linear_infinite] gap-4 w-max">
          {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
            <div
              key={`${t.name}-${i}`}
              className="w-[260px] shrink-0 bg-white/[0.05] backdrop-blur-md border border-white/[0.08] rounded-2xl px-4 py-3"
            >
              <p className="text-xs text-[#A2A2D0]/80 leading-relaxed mb-2">&ldquo;{t.quote}&rdquo;</p>
              <div className="text-[11px] font-semibold text-white">{t.name}</div>
              <div className="text-[10px] text-[#A2A2D0]/50">{t.role}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
