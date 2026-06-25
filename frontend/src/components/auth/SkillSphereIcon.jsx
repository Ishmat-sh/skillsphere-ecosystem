export default function SkillSphereIcon({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="ringTop" x1="0" y1="0" x2="48" y2="0">
          <stop offset="0%" stopColor="#FF5E62" />
          <stop offset="100%" stopColor="#FF8A65" />
        </linearGradient>
        <linearGradient id="ringMid" x1="0" y1="0" x2="48" y2="48">
          <stop offset="0%" stopColor="#00D2FF" />
          <stop offset="50%" stopColor="#7B61FF" />
          <stop offset="100%" stopColor="#FF00FF" />
        </linearGradient>
        <linearGradient id="ringBot" x1="48" y1="0" x2="0" y2="48">
          <stop offset="0%" stopColor="#FF00FF" />
          <stop offset="100%" stopColor="#7B61FF" />
        </linearGradient>
      </defs>
      <ellipse cx="24" cy="18" rx="18" ry="6" stroke="url(#ringTop)" strokeWidth="3.5" fill="none" transform="rotate(-20 24 24)" />
      <ellipse cx="24" cy="24" rx="18" ry="6" stroke="url(#ringMid)" strokeWidth="3.5" fill="none" />
      <ellipse cx="24" cy="30" rx="18" ry="6" stroke="url(#ringBot)" strokeWidth="3.5" fill="none" transform="rotate(20 24 24)" />
    </svg>
  );
}
