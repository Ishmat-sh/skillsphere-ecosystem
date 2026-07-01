import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/skillsphere-logo.png';
import MouseTrackingMesh from '../components/auth/MouseTrackingMesh';
import ParticleCanvas from '../components/auth/ParticleCanvas';
import CliTerminal from '../components/landing/CliTerminal';

export default function Landing() {
  const navigate = useNavigate();
  const [cliOpen, setCliOpen] = useState(false);

  return (
    <div className="h-dvh relative overflow-hidden bg-[#0f0f12] flex flex-col items-center justify-center">
      <MouseTrackingMesh />
      <ParticleCanvas />

      <div className="relative z-10 text-center px-6 max-w-2xl">
        <img src={logo} alt="SkillSphere" className="h-12 mx-auto mb-6" />
        <p className="text-[#A2A2D0]/60 text-xs uppercase tracking-[0.2em] mb-3">
          Intelligent Hyperlocal Freelance Ecosystem
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
          Find talent.{' '}
          <span className="bg-gradient-to-r from-[#FF5E62] via-[#7B61FF] to-[#00D2FF] bg-clip-text text-transparent">
            Not just freelancers.
          </span>
        </h1>
        <p className="text-[#A2A2D0]/70 mb-8 text-sm leading-relaxed">
          Connect with verified professionals in your neighbourhood — matched by skill, proximity, and trust.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate('/register')}
            className="bg-gradient-to-r from-[#FF5E62] via-[#7B61FF] to-[#E94E77] text-white font-semibold py-3 px-8 rounded-full hover:opacity-90 transition-opacity"
          >
            Get Started
          </button>
          <button
            onClick={() => navigate('/login')}
            className="border border-white/20 text-[#A2A2D0] py-3 px-8 rounded-full hover:bg-white/5 transition-colors"
          >
            Sign In
          </button>
        </div>
        <p className="text-[#A2A2D0]/30 text-xs mt-8 font-mono">Press ⌨ CLI for keyboard navigation</p>
      </div>

      <CliTerminal open={cliOpen} onToggle={() => setCliOpen(!cliOpen)} />
    </div>
  );
}
