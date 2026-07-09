import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from '../Logo';
import LiveTicker from './LiveTicker';

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-dvh bg-[#0f0f12] text-white overflow-auto">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FF00FF]/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#00D2FF]/8 rounded-full blur-[120px]" />
      </div>

      <header className="relative z-10 bg-black/80 backdrop-blur-md border-b border-white/5 px-6 py-3 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2">
          <Logo size="sm" />
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-[#A2A2D0]/70 hidden sm:block">
            {user?.name} · <span className="text-[#00D2FF]">{user?.role}</span>
          </span>
          <button onClick={logout} className="text-sm text-[#A2A2D0]/70 hover:text-white transition-colors">
            Logout
          </button>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <LiveTicker />
        {children}
      </main>
    </div>
  );
}
