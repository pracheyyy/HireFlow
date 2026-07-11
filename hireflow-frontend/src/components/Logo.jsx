export default function Logo({ size = 32, showText = true, dark = false }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="11" fill="url(#hf-gradient)" />
        <path
          d="M12 27L18.5 14.5L22.5 21.5L28 12"
          stroke="white"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <defs>
          <linearGradient id="hf-gradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1e3a8a" />
            <stop offset="1" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
      </svg>
      {showText && (
        <span
          style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 700,
            fontSize: size * 0.62,
            color: dark ? "#fff" : "var(--text-primary)",
            letterSpacing: "-0.01em",
          }}
        >
          HireFlow
        </span>
      )}
    </div>
  );
}
