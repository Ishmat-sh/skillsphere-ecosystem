export default function AuthIllustration() {
  return (
    <div className="hidden md:flex w-1/2 relative overflow-hidden bg-black">
      <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#00D2FF]/15 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#FF00FF]/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#FF5E62]/10 rounded-full blur-3xl" />

      <svg viewBox="0 0 500 600" className="relative z-10 w-full h-full p-6">
        <defs>
          <linearGradient id="barGrad1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00D2FF" />
            <stop offset="100%" stopColor="#7B61FF" />
          </linearGradient>
          <linearGradient id="barGrad2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF5E62" />
            <stop offset="100%" stopColor="#FF00FF" />
          </linearGradient>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#00D2FF" />
            <stop offset="100%" stopColor="#FF00FF" />
          </linearGradient>
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g transform="translate(20,20)">
          <rect width="320" height="160" rx="14" fill="#0d0d0d" stroke="#2a2a2a" />
          <polyline
            points="20,120 60,90 100,100 140,55 180,70 220,30 260,45 300,20"
            fill="none"
            stroke="url(#lineGrad)"
            strokeWidth="3"
            filter="url(#softGlow)"
          />
          {[
            [20, 120], [60, 90], [100, 100], [140, 55],
            [180, 70], [220, 30], [260, 45], [300, 20],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="4" fill="#A2A2D0" />
          ))}
          <text x="220" y="22" fontSize="11" fill="#A2A2D0" opacity="0.8">+128%</text>
          <text x="55" y="135" fontSize="10" fill="#666">Q1</text>
          <text x="290" y="14" fontSize="10" fill="#666">Q4</text>
        </g>

        <g transform="translate(370,30)">
          <circle r="40" fill="#0d0d0d" stroke="#2a2a2a" />
          <circle r="30" fill="none" stroke="#1a1a1a" strokeWidth="8" />
          <circle
            r="30"
            fill="none"
            stroke="url(#lineGrad)"
            strokeWidth="8"
            strokeDasharray="141 188"
            strokeLinecap="round"
            transform="rotate(-90)"
          />
          <text x="0" y="5" fontSize="14" fill="#A2A2D0" textAnchor="middle" fontWeight="bold">75%</text>
        </g>

        <g transform="translate(20,210)">
          <rect width="460" height="220" rx="14" fill="#0a0a0a" stroke="#2a2a2a" />
          {[
            { x: 40, h: 70, grad: 'barGrad1' },
            { x: 90, h: 110, grad: 'barGrad2' },
            { x: 140, h: 150, grad: 'barGrad1' },
            { x: 190, h: 90, grad: 'barGrad2' },
            { x: 240, h: 170, grad: 'barGrad1' },
            { x: 290, h: 60, grad: 'barGrad2' },
            { x: 340, h: 130, grad: 'barGrad1' },
            { x: 390, h: 100, grad: 'barGrad2' },
          ].map((b, i) => (
            <rect
              key={i}
              x={b.x}
              y={190 - b.h}
              width="28"
              height={b.h}
              rx="4"
              fill={`url(#${b.grad})`}
              opacity="0.95"
            />
          ))}
          <line x1="20" y1="190" x2="440" y2="190" stroke="#2a2a2a" />
        </g>

        <g transform="translate(20,455)">
          <rect width="150" height="120" rx="14" fill="#0d0d0d" stroke="#2a2a2a" />
          {Array.from({ length: 6 }).map((_, row) =>
            Array.from({ length: 8 }).map((_, col) => {
              const opacities = [0.15, 0.3, 0.5, 0.7, 0.9];
              const o = opacities[(row + col) % opacities.length];
              return (
                <rect
                  key={`${row}-${col}`}
                  x={10 + col * 17}
                  y={10 + row * 17}
                  width="14"
                  height="14"
                  rx="2"
                  fill="#00D2FF"
                  opacity={o}
                />
              );
            })
          )}
        </g>

        <g transform="translate(190,455)">
          <rect width="290" height="120" rx="14" fill="#0a0a0a" stroke="#2a2a2a" />
          {[20, 45, 70, 95].map((y, i) => (
            <g key={i}>
              <line x1="20" y1={y} x2="270" y2={y} stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" />
              <circle cx={60 + i * 45} cy={y} r="6" fill="#FF00FF" filter="url(#softGlow)" />
            </g>
          ))}
        </g>

        <g transform="translate(330,170)">
          <rect width="90" height="34" rx="8" fill="#111" stroke="#333" />
          <text x="8" y="14" fontSize="9" fill="#A2A2D0">Revenue</text>
          <text x="8" y="26" fontSize="11" fill="#fff" fontWeight="bold">+34.8%</text>
        </g>

        <g transform="translate(360,400)">
          <rect width="100" height="34" rx="8" fill="#111" stroke="#333" />
          <text x="8" y="14" fontSize="9" fill="#A2A2D0">Engagement</text>
          <text x="8" y="26" fontSize="11" fill="#fff" fontWeight="bold">12.7K</text>
        </g>

        <circle cx="450" cy="120" r="3" fill="#00D2FF" opacity="0.7" />
        <circle cx="40" cy="200" r="2" fill="#FF5E62" opacity="0.5" />
        <circle cx="470" cy="450" r="3" fill="#FF00FF" opacity="0.6" />
      </svg>
    </div>
  );
}
