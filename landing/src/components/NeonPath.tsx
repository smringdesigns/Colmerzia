import React from 'react';

type PathVariant = 'wave' | 'pulse' | 'circuit' | 'loop';

interface NeonPathProps {
    variant?: PathVariant;
    className?: string;
    reverseGradient?: boolean;
}

export default function NeonPath({ variant = 'wave', className = '', reverseGradient = false }: NeonPathProps) {
    const paths = {
        wave: "M-20,110 C40,40 80,180 140,110 C180,60 220,140 290,90",
        pulse: "M-10,110 H40 L60,40 L90,190 L120,80 L140,110 H290",
        circuit: "M-10,60 H60 V160 H130 V70 H200 V120 H290",
        loop: "M-10,110 C50,110 80,20 140,60 C200,100 120,180 180,160 C240,140 220,60 290,90"
    };

    return (
        <div className={`absolute pointer-events-none select-none z-0 ${className}`} aria-hidden="true">
            <svg
                width="100%"
                height="100%"
                viewBox="0 0 280 220"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="drop-shadow-[0_0_15px_rgba(34,211,238,0.6)] animate-pulse overflow-visible"
                style={{ animationDuration: '4s' }}
            >
                <defs>
                    <linearGradient id={`neonGrad-${variant}`} x1={reverseGradient ? "100%" : "0%"} y1="0%" x2={reverseGradient ? "0%" : "100%"} y2="100%">
                        <stop offset="0%" stopColor="#22d3ee" />   {/* cyan-400 */}
                        <stop offset="50%" stopColor="#3b82f6" />  {/* blue-500 */}
                        <stop offset="100%" stopColor="#ec4899" /> {/* pink-500 */}
                    </linearGradient>
                </defs>
                <path
                    d={paths[variant]}
                    stroke={`url(#neonGrad-${variant})`}
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </div>
    );
}