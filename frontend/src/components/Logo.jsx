import React from 'react';

export default function Logo({ size = 'md', className = '' }) {
  const iconSizes = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  return (
    <div className={`flex items-center gap-2.5 font-bold tracking-tight select-none ${className}`}>
      {/* Hyperlocal Network Sphere SVG */}
      <svg
        className={`${iconSizes[size]} shrink-0`}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF5E62" />
            <stop offset="50%" stopColor="#7B61FF" />
            <stop offset="100%" stopColor="#00D2FF" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer orbital rings representing hyper-locality */}
        <circle cx="50" cy="50" r="40" stroke="url(#logo-grad)" strokeWidth="2.5" strokeDasharray="6 6" opacity="0.6" />
        <circle cx="50" cy="50" r="30" stroke="url(#logo-grad)" strokeWidth="1.5" opacity="0.4" />
        
        {/* Core connected node network representing matching skills */}
        <line x1="30" y1="35" x2="50" y2="20" stroke="url(#logo-grad)" strokeWidth="2" />
        <line x1="50" y1="20" x2="70" y2="35" stroke="url(#logo-grad)" strokeWidth="2" />
        <line x1="70" y1="35" x2="62" y2="65" stroke="url(#logo-grad)" strokeWidth="2" />
        <line x1="62" y1="65" x2="38" y2="65" stroke="url(#logo-grad)" strokeWidth="2" />
        <line x1="38" y1="65" x2="30" y2="35" stroke="url(#logo-grad)" strokeWidth="2" />
        
        <line x1="30" y1="35" x2="50" y2="50" stroke="url(#logo-grad)" strokeWidth="1.5" />
        <line x1="70" y1="35" x2="50" y2="50" stroke="url(#logo-grad)" strokeWidth="1.5" />
        <line x1="50" y1="20" x2="50" y2="50" stroke="url(#logo-grad)" strokeWidth="1.5" />
        <line x1="62" y1="65" x2="50" y2="50" stroke="url(#logo-grad)" strokeWidth="1.5" />
        <line x1="38" y1="65" x2="50" y2="50" stroke="url(#logo-grad)" strokeWidth="1.5" />

        {/* Node points */}
        <circle cx="30" cy="35" r="5" fill="#FF5E62" />
        <circle cx="50" cy="20" r="5" fill="#7B61FF" />
        <circle cx="70" cy="35" r="5" fill="#00D2FF" />
        <circle cx="62" cy="65" r="5" fill="url(#logo-grad)" />
        <circle cx="38" cy="65" r="5" fill="url(#logo-grad)" />
        <circle cx="50" cy="50" r="6" fill="url(#logo-grad)" filter="url(#glow)" />
      </svg>
      <span className={`${textSizes[size]} font-extrabold bg-gradient-to-r from-white via-white to-[#A2A2D0] bg-clip-text text-transparent`}>
        Skill<span className="bg-gradient-to-r from-[#FF5E62] via-[#7B61FF] to-[#00D2FF] bg-clip-text text-transparent">Sphere</span>
      </span>
    </div>
  );
}
