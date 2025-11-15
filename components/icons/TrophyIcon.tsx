
import React from 'react';

const TrophyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9a9.75 9.75 0 011.06-5.613A4.501 4.501 0 0112 7.5c1.44 0 2.73.727 3.44 1.887A9.75 9.75 0 0116.5 18.75z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v3" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h3m10.5 0h3" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a2.25 2.25 0 002.25-2.25H9.75A2.25 2.25 0 0012 21z" />
  </svg>
);

export default TrophyIcon;
