export function NextLogo() {
  return (
    <svg viewBox="0 0 72 72" role="img" aria-label="Next.js" className="size-full">
      <rect width="72" height="72" className="fill-neutral-900" />
      <path
        d="M24 52V20h5l19 24V20h5v32h-5L29 28v24z"
        fill="#fff"
      />
    </svg>
  );
}

export function DockerLogo() {
  return (
    <svg viewBox="0 0 72 72" role="img" aria-label="Docker" className="size-full">
      <g fill="#2496ed">
        {[0, 1, 2, 3].map((i) => (
          <rect key={`a${i}`} x={14 + i * 8} y="28" width="7" height="7" />
        ))}
        {[1, 2, 3].map((i) => (
          <rect key={`b${i}`} x={14 + i * 8} y="20" width="7" height="7" />
        ))}
        <rect x="30" y="12" width="7" height="7" />
        <path d="M6 38h54c3-1 5-3 6-6 3 1 4 3 3 5-2 12-12 19-27 19C20 56 8 50 6 38z" />
      </g>
    </svg>
  );
}

export function TypeScriptLogo() {
  return (
    <svg viewBox="0 0 72 72" role="img" aria-label="TypeScript" className="size-full">
      <rect width="72" height="72" fill="#3178c6" />
      <text
        x="36"
        y="50"
        textAnchor="middle"
        fontSize="34"
        fontWeight="700"
        fill="#fff"
        fontFamily="Inter, sans-serif"
      >
        TS
      </text>
    </svg>
  );
}
