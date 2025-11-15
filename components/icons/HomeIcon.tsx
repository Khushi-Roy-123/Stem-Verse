
import React from 'react';

const HomeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a.75.75 0 011.06 0l8.954 8.955M3 11.25V21h18V11.25m-18 0l-1.5-1.5M21 11.25l1.5-1.5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21V12m0 0l5-5m-5 5l-5-5" />
  </svg>
);

export default HomeIcon;
