import React, { useEffect, useState } from 'react';

const CinematicCursor = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [isHidden, setIsHidden] = useState(true);

    useEffect(() => {
        const updatePosition = (e) => {
            setPosition({ x: e.clientX, y: e.clientY });
            setIsHidden(false);
        };

        const handleMouseOver = (e) => {
            const target = e.target;
            const isClickable = target.closest('button, a, .cursor-pointer, input, textarea');
            setIsHovering(!!isClickable);
        };

        const handleMouseLeave = () => setIsHidden(true);
        const handleMouseEnter = () => setIsHidden(false);

        window.addEventListener('mousemove', updatePosition);
        window.addEventListener('mouseover', handleMouseOver);
        document.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('mouseenter', handleMouseEnter);

        return () => {
            window.removeEventListener('mousemove', updatePosition);
            window.removeEventListener('mouseover', handleMouseOver);
            document.removeEventListener('mouseleave', handleMouseLeave);
            document.removeEventListener('mouseenter', handleMouseEnter);
        };
    }, []);

    if (isHidden) return null;

    return (
        <>
            {/* Main Dot */}
            <div
                className="fixed top-0 left-0 w-2 h-2 bg-gold rounded-full pointer-events-none z-[9999] transition-transform duration-100 ease-out mix-blend-difference"
                style={{
                    transform: `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)`,
                }}
            />
            {/* Outer Ring */}
            <div
                className={`fixed top-0 left-0 rounded-full pointer-events-none z-[9998] transition-all duration-500 ease-out border border-gold/30 ${isHovering ? 'w-16 h-16 bg-gold/5 scale-110' : 'w-10 h-10 scale-100'
                    }`}
                style={{
                    transform: `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)`,
                }}
            />
        </>
    );
};

export default CinematicCursor;
