import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function LiveTicker() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetch = () =>
      api.get('/api/analytics/ticker').then((res) => setItems(res.data)).catch(() => {});
    fetch();
    const interval = setInterval(fetch, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!items.length) return null;

  return (
    <div className="overflow-hidden bg-black/40 border border-white/5 rounded-xl py-2 mb-4">
      <div className="flex animate-[marquee_40s_linear_infinite] gap-8 w-max px-4">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="text-xs text-[#A2A2D0]/70 whitespace-nowrap">
            <span className="text-[#00D2FF] mr-2">●</span>
            {item.message}
            {item.amount ? ` — $${item.amount}` : ''}
          </span>
        ))}
      </div>
    </div>
  );
}
