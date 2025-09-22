import React from 'react';

export const IconDeconstruct: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 2H6a2 2 0 0 0-2 2v6" />
    <path d="M12 10h4a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-6a2 2 0 0 1-2-2v-4" />
    <path d="M4 14h2" />
    <path d="M14 4h2" />
    <path d="m18 8 2-2" />
    <path d="m6 18 2-2" />
  </svg>
);