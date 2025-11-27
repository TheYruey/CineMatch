import { useEffect, useRef } from 'react';

export const useIntersectionObserver = (
    callback: () => void,
    options: IntersectionObserverInit = { root: null, rootMargin: '0px', threshold: 1.0 }
) => {
    const targetRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            const [entry] = entries;
            if (entry.isIntersecting) {
                callback();
            }
        }, options);

        const currentTarget = targetRef.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [callback, options]);

    return targetRef;
};
