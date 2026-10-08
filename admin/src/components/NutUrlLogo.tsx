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
      {showBg && <rect width="100" height="100" rx="24" fill="#f0f5f8" />}
      <path
        d="M 27 70 V 42 C 27 27 38 19 50 19 C 58 19 63 24 63 43"
        fill="none"
        stroke="#0a3443"
        strokeWidth="13"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 37 57 C 37 76 42 81 50 81 C 62 81 73 73 73 58 V 30"
        fill="none"
        stroke="#176075"
        strokeWidth="13"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default NutUrlLogo;
