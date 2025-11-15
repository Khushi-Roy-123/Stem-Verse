import React from 'react';

const Logo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M50 25 V 75 M25 50 H 75" stroke="currentColor" strokeWidth="12" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default Logo;