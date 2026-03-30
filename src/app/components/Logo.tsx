export function Logo({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Leaf/Plant Icon for SAGRI */}
      <circle cx="50" cy="50" r="45" fill="#10b981" opacity="0.2" />
      <path
        d="M50 20 Q35 35 35 50 Q35 65 50 80"
        stroke="#10b981"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M50 20 Q65 35 65 50 Q65 65 50 80"
        stroke="#059669"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M35 40 Q45 38 50 40"
        stroke="#10b981"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M50 40 Q55 38 65 40"
        stroke="#059669"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M35 55 Q45 53 50 55"
        stroke="#10b981"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M50 55 Q55 53 65 55"
        stroke="#059669"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="50" cy="25" r="5" fill="#fbbf24" />
    </svg>
  );
}
