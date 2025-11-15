import React from 'react';

const ConfettiPiece: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
    <div className="absolute w-2 h-4" style={style}></div>
);

const Confetti: React.FC = () => {
    const colors = ['#93C5FD', '#60A5FA', '#3B82F6', '#2563EB', '#BFDBFE'];
    const pieces = Array.from({ length: 100 }).map((_, index) => {
        const color = colors[Math.floor(Math.random() * colors.length)];
        const left = `${Math.random() * 100}%`;
        const animationDelay = `${Math.random() * 5}s`;
        const animationDuration = `${2 + Math.random() * 3}s`;
        const rotation = `rotate(${Math.random() * 360}deg)`;
        const transform = `translateX(-50%) ${rotation}`;

        const style: React.CSSProperties = {
            backgroundColor: color,
            left: left,
            animation: `fall ${animationDuration} linear ${animationDelay} infinite`,
            transform: transform,
            position: 'absolute',
        };

        return <ConfettiPiece key={index} style={style} />;
    });

    return (
        <>
            <style>
                {`
                @keyframes fall {
                    0% { top: -10%; opacity: 1; transform: rotate(${Math.random() * 360}deg); }
                    100% { top: 110%; opacity: 0; transform: rotate(${Math.random() * 720}deg); }
                }
                `}
            </style>
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-50">
                {pieces}
            </div>
        </>
    );
};

export default Confetti;