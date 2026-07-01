import { Link } from 'react-router-dom';
import logo from '../../assets/skillsphere-logo.png';

export default function AuthHeader({ alternateLink, alternateLabel }) {
  return (
    <header className="shrink-0 bg-black px-6 sm:px-8 py-3 sm:py-3.5 flex items-center justify-between">
      <img src={logo} alt="SkillSphere" className="h-7 sm:h-8 w-auto object-contain" />

      <Link
        to={alternateLink}
        className="flex items-center gap-1.5 text-sm font-medium text-[#A2A2D0] hover:text-white transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        {alternateLabel}
      </Link>
    </header>
  );
}
