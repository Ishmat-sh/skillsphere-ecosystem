function getStrength(password) {
  if (!password) return { score: 0, label: '', color: 'bg-gray-200' };

  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const levels = [
    { label: 'Weak', color: 'bg-red-500' },
    { label: 'Fair', color: 'bg-orange-500' },
    { label: 'Good', color: 'bg-yellow-400' },
    { label: 'Strong', color: 'bg-emerald-400' },
  ];

  const level = levels[Math.max(0, score - 1)] || levels[0];
  return { score, label: level.label, color: level.color };
}

export default function PasswordStrength({ password }) {
  const { score, label, color } = getStrength(password);
  if (!password) return null;

  return (
    <div className="mt-2 px-1">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i <= score ? color : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      <p className="text-[11px] text-gray-500">
        Strength: <span className="font-medium text-gray-700">{label}</span>
      </p>
    </div>
  );
}
