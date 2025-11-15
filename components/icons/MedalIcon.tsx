
import React from 'react';

const MedalIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9a9.75 9.75 0 1011.036-9.75.75.75 0 00-1.06-1.062A11.25 11.25 0 0112 3.75v1.875m-3.75 9.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0z" />
    </svg>
);

export default MedalIcon;
