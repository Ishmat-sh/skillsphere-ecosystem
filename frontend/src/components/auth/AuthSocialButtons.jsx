export default function AuthSocialButtons({ action = 'Log in' }) {
  return (
    <>
      <div className="flex items-center my-4">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="px-3 text-xs text-gray-400">OR</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          className="flex items-center justify-center gap-1.5 bg-gray-900 hover:bg-gray-800 text-white font-medium py-2.5 rounded-full transition-colors text-xs"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-2.05 1.62-3.18 1.53-.13-1.17.39-2.31 1.09-3.08.78-.86 2.07-1.49 3.27-1.53zm3.6 16.27c-.21.47-.49.93-.84 1.36-.93 1.14-1.85 2.27-3.36 2.29-1.46.03-1.93-.88-3.6-.88-1.67 0-2.2.86-3.59.91-1.51.05-2.66-1.23-3.6-2.36-1.94-2.36-3.42-6.68-1.43-9.61.98-1.46 2.74-2.39 4.39-2.41 1.5-.03 2.46.93 3.59.93 1.13 0 2.43-1.05 4.13-.93.69.03 2.65.27 3.97 2.04-.1.07-2.36 1.38-2.33 4.1.03 3.24 2.84 4.32 2.67 4.43z" />
          </svg>
          Apple
        </button>
        <button
          type="button"
          className="flex items-center justify-center gap-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-2.5 rounded-full transition-colors text-xs"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.59 1 10.25 1 12s.43 3.41 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Google
        </button>
      </div>
    </>
  );
}
