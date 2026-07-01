import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthHeader from './AuthHeader';
import AuthShowcasePanel from './AuthShowcasePanel';
import MouseTrackingMesh from './MouseTrackingMesh';
import ParticleCanvas from './ParticleCanvas';

export default function AuthLayout({
  mode,
  title,
  error,
  children,
  footerText,
  footerLinkText,
  footerLinkTo,
  compact = false,
}) {
  const isLogin = mode === 'login';
  const alternateLink = isLogin ? '/register' : '/login';
  const alternateLabel = isLogin ? 'Sign Up' : 'Sign In';
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (error) {
      setShake(true);
      const timer = setTimeout(() => setShake(false), 500);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="h-dvh flex overflow-hidden bg-[#0f0f12] relative">
      <MouseTrackingMesh />

      <div className="w-full lg:w-1/2 h-dvh flex flex-col overflow-hidden relative z-10">
        <ParticleCanvas />
        <AuthHeader alternateLink={alternateLink} alternateLabel={alternateLabel} />

        <main className={`flex-1 min-h-0 flex items-center justify-center px-6 sm:px-10 bg-white/80 backdrop-blur-sm ${compact ? 'py-2' : 'py-3'}`}>
          <div className="w-full max-w-[380px]">
            <h1 className={`font-bold text-gray-900 ${compact ? 'text-2xl sm:text-3xl mb-4' : 'text-3xl sm:text-4xl mb-5'}`}>
              {title}
            </h1>

            <div
              className={`rounded-3xl border border-white/40 bg-white/55 backdrop-blur-xl shadow-[0_8px_32px_rgba(123,97,255,0.12)] px-6 py-6 sm:px-7 sm:py-7 ${shake ? 'animate-shake' : ''}`}
            >
              {error && (
                <div className="bg-red-500/10 border border-red-300/50 text-red-600 text-sm p-2.5 rounded-xl mb-4 backdrop-blur-sm">
                  {error}
                </div>
              )}

              {children}
            </div>

            {footerText && footerLinkTo && (
              <p className="text-xs text-gray-500 text-center mt-4">
                {footerText}{' '}
                <Link to={footerLinkTo} className="text-[#FF5E62] hover:text-[#E94E77] font-medium transition-colors">
                  {footerLinkText}
                </Link>
              </p>
            )}
          </div>
        </main>

        <footer className="shrink-0 bg-white/80 backdrop-blur-sm px-6 sm:px-10 pb-4 pt-3 flex items-center justify-between text-[11px] text-gray-400 border-t border-gray-200/50">
          <span>© 2025 SkillSphere Inc.</span>
          <button type="button" className="flex items-center gap-1 hover:text-gray-600 transition-colors">
            English
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </footer>
      </div>

      <AuthShowcasePanel />
    </div>
  );
}
