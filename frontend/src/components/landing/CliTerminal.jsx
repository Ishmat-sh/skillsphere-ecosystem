import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HELP = {
  '/register': 'Navigate to registration',
  '/login': 'Navigate to login',
  '/dashboard': 'Open your dashboard',
  '/gigs search <term>': 'Search gigs on dashboard (freelancers)',
  '/help': 'Show available commands',
  clear: 'Clear terminal output',
};

export default function CliTerminal({ open, onToggle }) {
  const [history, setHistory] = useState([
    { type: 'system', text: 'SkillSphere CLI v1.0 — type /help for commands' },
  ]);
  const [input, setInput] = useState('');
  const navigate = useNavigate();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const run = (cmd) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    setHistory((h) => [...h, { type: 'input', text: `> ${trimmed}` }]);

    if (trimmed === 'clear') {
      setHistory([]);
      return;
    }

    if (trimmed === '/help') {
      Object.entries(HELP).forEach(([k, v]) => {
        setHistory((h) => [...h, { type: 'output', text: `${k} — ${v}` }]);
      });
      return;
    }

    if (trimmed.startsWith('/gigs search ')) {
      const term = trimmed.replace('/gigs search ', '');
      navigate(`/dashboard?search=${encodeURIComponent(term)}`);
      setHistory((h) => [...h, { type: 'output', text: `Searching gigs for "${term}"...` }]);
      return;
    }

    if (trimmed === '/register' || trimmed === '/login' || trimmed === '/dashboard') {
      navigate(trimmed);
      setHistory((h) => [...h, { type: 'output', text: `Navigating to ${trimmed}` }]);
      return;
    }

    setHistory((h) => [...h, { type: 'error', text: `Unknown command: ${trimmed}. Type /help` }]);
  };

  if (!open) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-4 right-4 z-50 bg-black/80 border border-[#7B61FF]/40 text-[#A2A2D0] text-xs px-4 py-2 rounded-xl hover:border-[#00D2FF]/50 transition-colors font-mono"
      >
        ⌨ CLI
      </button>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 border-t border-[#7B61FF]/30 backdrop-blur-xl">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
          <span className="text-xs text-[#A2A2D0]/60 font-mono">skillsphere-cli</span>
          <button onClick={onToggle} className="text-[#A2A2D0]/50 hover:text-white text-xs">Minimize</button>
        </div>
        <div className="h-40 overflow-y-auto px-4 py-2 font-mono text-xs space-y-1">
          {history.map((line, i) => (
            <div
              key={i}
              className={
                line.type === 'input' ? 'text-[#00D2FF]' :
                line.type === 'error' ? 'text-red-400' :
                line.type === 'system' ? 'text-[#7B61FF]' :
                'text-[#A2A2D0]/80'
              }
            >
              {line.text}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <form
          onSubmit={(e) => { e.preventDefault(); run(input); setInput(''); }}
          className="flex items-center gap-2 px-4 py-2 border-t border-white/5"
        >
          <span className="text-[#FF5E62] font-mono text-sm">›</span>
          <input
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent text-white font-mono text-sm outline-none placeholder-[#A2A2D0]/30"
            placeholder="/login, /register, /gigs search javascript..."
          />
        </form>
      </div>
    </div>
  );
}
