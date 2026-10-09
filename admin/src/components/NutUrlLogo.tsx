import React from 'react';

interface LogoProps {
  size?: number;
  showBg?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const NutUrlLogo: React.FC<LogoProps> = ({
  size = 32,
  showBg = true,
  className = '',
  style = {}
}) => {
  const idSuffix = React.useId().replace(/:/g, '');

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{
        display: 'inline-block',
        flexShrink: 0,
        verticalAlign: 'middle',
        width: `${size}px`,
        height: `${size}px`,
        ...style
      }}
    >
      <defs>
        <linearGradient id={`adminNutGrad1-${idSuffix}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
        <linearGradient id={`adminNutGrad2-${idSuffix}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
        <linearGradient id={`adminNutBg-${idSuffix}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
      </defs>

      {/* Background Container Box */}
      {showBg && (
        <rect
          width="100"
          height="100"
          rx="24"
          fill={`url(#adminNutBg-${idSuffix})`}
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1.5"
        />
      )}

      {/* Left 'N' Arch Ribbon */}
      <path
        d="M 28 72 V 42 C 28 29 37 20 50 20 C 60 20 66 26 66 38"
        fill="none"
        stroke={`url(#adminNutGrad1-${idSuffix})`}
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Right 'N' Arch Ribbon */}
      <path
        d="M 34 62 C 34 74 40 80 50 80 C 63 80 72 71 72 58 V 28"
        fill="none"
        stroke={`url(#adminNutGrad2-${idSuffix})`}
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Center Connection Link Dot */}
      <circle cx="50" cy="50" r="3.5" fill="#ffffff" />
    </svg>
  );
};

export default NutUrlLogo;
