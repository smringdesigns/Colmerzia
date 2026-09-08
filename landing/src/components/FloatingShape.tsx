import React from 'react';

type ShapeType = 'circle' | 'square' | 'polygon' | 'petal';
type ColorType = 'cyan' | 'magenta' | 'orange' | 'blue';

interface FloatingShapeProps {
    type: ShapeType;
    color: ColorType;
    className?: string;
    delay?: string;
}

export default function FloatingShape({ type, color, className = '', delay = '0s' }: FloatingShapeProps) {
    // Usamos colores nativos de Tailwind para GARANTIZAR que se vean
    const colorStyles = {
        cyan: 'bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.8)]',
        magenta: 'bg-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.8)]',
        orange: 'bg-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.8)]',
        blue: 'bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.8)]',
    };

    const shapeStyles = {
        circle: 'rounded-full',
        square: 'rounded-md rotate-[15deg]',
        petal: 'rounded-tl-md rounded-br-2xl rounded-tr-2xl rounded-bl-2xl',
        polygon: '', 
    };

    // animate-pulse hace que el resplandor palpite suavemente
    const baseClasses = `absolute pointer-events-none animate-pulse ${colorStyles[color]} ${className}`;

    if (type === 'polygon') {
        return (
            <div
                className={baseClasses}
                style={{
                    clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
                    animationDelay: delay,
                    animationDuration: '4s'
                }}
            />
        );
    }

    return (
        <div
            className={`${baseClasses} ${shapeStyles[type]}`}
            style={{ animationDelay: delay, animationDuration: '4s' }}
        />
    );
}