import { Link } from 'react-router-dom';
import logo from '../../assets/skillsphere-logo.png';

export default function AuthHeader({ title, alternateLink, alternateLabel }) {
  return (
    <header className="shrink-0 bg-black lg:rounded-tl-[52px] px-6 sm:px-10 pt-5 sm:pt-6 pb-6 sm:pb-7">
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <img src={logo} alt="SkillSphere" className="h-8 sm:h-9 w-auto object-contain" />

        <Link
          to={alternateLink}
          className="flex items-center gap-1.5 text-sm font-medium text-[#A2A2D0] hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          {alternateLabel}
        </Link>
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold text-white">{title}</h1>
    </header>
  );
}
