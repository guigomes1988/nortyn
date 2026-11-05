import React from 'react';

interface FlagProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

export function BrazilFlag({ className = 'w-5 h-3.5', width = 20, height = 14 }: FlagProps) {
  return (
    <svg
      viewBox="0 0 20 14"
      width={width}
      height={height}
      className={`rounded-[2px] shadow-sm shrink-0 overflow-hidden ${className}`}
      aria-label="Bandeira do Brasil"
    >
      <rect width="20" height="14" fill="#009b3a" />
      <polygon points="10,1.5 18.5,7 10,12.5 1.5,7" fill="#fedf00" />
      <circle cx="10" cy="7" r="3.4" fill="#002776" />
      <path
        d="M 6.8,7.8 C 8,6.8 11.8,6.8 13.2,7.5"
        stroke="#ffffff"
        strokeWidth="0.75"
        fill="none"
      />
    </svg>
  );
}

export function UsaFlag({ className = 'w-5 h-3.5', width = 20, height = 14 }: FlagProps) {
  return (
    <svg
      viewBox="0 0 20 14"
      width={width}
      height={height}
      className={`rounded-[2px] shadow-sm shrink-0 overflow-hidden ${className}`}
      aria-label="Bandeira dos Estados Unidos"
    >
      {/* 13 Stripes */}
      <rect width="20" height="14" fill="#ffffff" />
      <rect y="0" width="20" height="1.077" fill="#b22234" />
      <rect y="2.154" width="20" height="1.077" fill="#b22234" />
      <rect y="4.308" width="20" height="1.077" fill="#b22234" />
      <rect y="6.462" width="20" height="1.077" fill="#b22234" />
      <rect y="8.615" width="20" height="1.077" fill="#b22234" />
      <rect y="10.769" width="20" height="1.077" fill="#b22234" />
      <rect y="12.923" width="20" height="1.077" fill="#b22234" />
      {/* Canton */}
      <rect width="8" height="7.538" fill="#3c3b6e" />
      {/* Stars pattern representation */}
      <g fill="#ffffff">
        <circle cx="1.6" cy="1.3" r="0.45" />
        <circle cx="3.2" cy="1.3" r="0.45" />
        <circle cx="4.8" cy="1.3" r="0.45" />
        <circle cx="6.4" cy="1.3" r="0.45" />
        <circle cx="2.4" cy="2.5" r="0.45" />
        <circle cx="4.0" cy="2.5" r="0.45" />
        <circle cx="5.6" cy="2.5" r="0.45" />
        <circle cx="1.6" cy="3.7" r="0.45" />
        <circle cx="3.2" cy="3.7" r="0.45" />
        <circle cx="4.8" cy="3.7" r="0.45" />
        <circle cx="6.4" cy="3.7" r="0.45" />
        <circle cx="2.4" cy="4.9" r="0.45" />
        <circle cx="4.0" cy="4.9" r="0.45" />
        <circle cx="5.6" cy="4.9" r="0.45" />
        <circle cx="1.6" cy="6.1" r="0.45" />
        <circle cx="3.2" cy="6.1" r="0.45" />
        <circle cx="4.8" cy="6.1" r="0.45" />
        <circle cx="6.4" cy="6.1" r="0.45" />
      </g>
    </svg>
  );
}

export function SpainFlag({ className = 'w-5 h-3.5', width = 20, height = 14 }: FlagProps) {
  return (
    <svg
      viewBox="0 0 20 14"
      width={width}
      height={height}
      className={`rounded-[2px] shadow-sm shrink-0 overflow-hidden ${className}`}
      aria-label="Bandeira da Espanha"
    >
      {/* Red, Yellow (2x), Red */}
      <rect width="20" height="3.5" fill="#aa151b" />
      <rect y="3.5" width="20" height="7" fill="#f1bf00" />
      <rect y="10.5" width="20" height="3.5" fill="#aa151b" />
      {/* Coat of arms stylized badge */}
      <g transform="translate(4, 5.2) scale(0.7)">
        <rect x="0" y="1" width="3" height="3.8" rx="0.5" fill="#aa151b" />
        <rect x="0.6" y="1.6" width="1.8" height="2.6" fill="#f1bf00" />
        <circle cx="1.5" cy="0.6" r="0.9" fill="#aa151b" />
        <circle cx="1.5" cy="0.6" r="0.5" fill="#ffffff" />
      </g>
    </svg>
  );
}
