import { useEffect, useState } from 'react';

export default function MouseTrackingMesh({ className = '' }) {
  const [pos, setPos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const handleMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setPos({ x, y });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <div
        className="absolute w-[520px] h-[520px] rounded-full blur-[100px] transition-all duration-700 ease-out opacity-40"
        style={{
          left: `${pos.x * 0.45}%`,
          top: `${pos.y * 0.4}%`,
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, #FF5E62 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute w-[480px] h-[480px] rounded-full blur-[90px] transition-all duration-1000 ease-out opacity-35"
        style={{
          left: `${50 + (pos.x - 50) * 0.35}%`,
          top: `${50 + (pos.y - 50) * 0.35}%`,
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, #7B61FF 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute w-[440px] h-[440px] rounded-full blur-[80px] transition-all duration-500 ease-out opacity-30"
        style={{
          left: `${pos.x * 0.6}%`,
          top: `${pos.y * 0.55}%`,
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, #00D2FF 0%, transparent 70%)',
        }}
      />
    </div>
  );
}
