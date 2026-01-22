import { useEffect, useRef, useState } from 'react';

export const useScrollReveal = (options = {}) => {
    const elementRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                if (options.once !== false) {
                    observer.unobserve(entry.target);
                }
            } else if (options.once === false) {
                setIsVisible(false);
            }
        }, {
            threshold: options.threshold || 0,
            rootMargin: options.rootMargin || '0px',
        });

        const currentElement = elementRef.current;
        if (currentElement) {
            observer.observe(currentElement);
        }

        return () => {
            if (currentElement) {
                observer.unobserve(currentElement);
            }
        };
    }, [options.once, options.threshold, options.rootMargin]);

    return [elementRef, isVisible];
};
