import React, { useState, useEffect } from 'react';
import { DiceFive } from '@phosphor-icons/react';

interface ShuffleButtonProps {
    onClick: () => void;
}

export const ShuffleButton: React.FC<ShuffleButtonProps> = ({ onClick }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            // Calculate distance to bottom
            const scrolledToBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
            setIsVisible(!scrolledToBottom);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <button
            onClick={onClick}
            className={`group fixed bottom-8 right-8 z-50 flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-gradient-to-tr from-primary via-accent to-primary shadow-[0_0_20px_oklch(var(--primary)/0.5)] transition-all duration-300 ease-in-out ${isVisible
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-10 scale-90 pointer-events-none'
                } hover:scale-110 active:scale-95`}
            aria-label="¡Sorpréndeme!"
        >
            <DiceFive
                size={32}
                weight="fill"
                className="text-primary-foreground transition-transform duration-500 group-hover:rotate-180"
            />
        </button>
    );
};
