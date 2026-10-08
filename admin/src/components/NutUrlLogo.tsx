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
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
    >
      {showBg && <rect width="100" height="100" rx="24" fill="#f0f4f8" />}
      <path
        d="M 28 70 V 42 C 28 29 37 21 49 21 C 56 21 61 27 63 44"
        fill="none"
        stroke="#0a3443"
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 37 56 C 45 64 54 78 64 78 C 72 78 72 68 72 30"
        fill="none"
        stroke="#196377"
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default NutUrlLogo;
