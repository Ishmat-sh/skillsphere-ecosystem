import { Link } from 'react-router-dom';
import AuthHeroPanel from './AuthHeroPanel';
import AuthHeader from './AuthHeader';

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

  return (
    <div className="h-dvh flex overflow-hidden bg-[#1a1218]">
      <AuthHeroPanel />

      <div className="w-full lg:w-[54%] h-dvh flex flex-col overflow-hidden bg-white lg:rounded-tl-[52px] lg:-ml-6 relative z-10">
        <AuthHeader
          title={title}
          alternateLink={alternateLink}
          alternateLabel={alternateLabel}
        />

        <main className={`flex-1 min-h-0 flex items-center justify-center px-6 sm:px-10 ${compact ? 'py-2' : 'py-3'}`}>
          <div className="w-full max-w-[380px]">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-2.5 rounded-xl mb-3">
                {error}
              </div>
            )}

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm px-6 py-6 sm:px-7 sm:py-7">
              {children}
            </div>

            {footerText && footerLinkTo && (
              <p className="text-xs text-gray-400 text-center mt-4">
                {footerText}{' '}
                <Link to={footerLinkTo} className="text-[#FF5E62] hover:text-[#E94E77] font-medium transition-colors">
                  {footerLinkText}
                </Link>
              </p>
            )}
          </div>
        </main>

        <footer className="shrink-0 px-6 sm:px-10 pb-4 flex items-center justify-between text-[11px] text-gray-400 border-t border-gray-200/60 pt-3 mx-6 sm:mx-10">
          <span>© 2025 SkillSphere Inc.</span>
          <div className="flex items-center gap-3">
            <button type="button" className="hover:text-gray-600 transition-colors">
              Contact Us
            </button>
            <button type="button" className="flex items-center gap-1 hover:text-gray-600 transition-colors">
              English
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
