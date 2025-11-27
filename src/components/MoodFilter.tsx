import React from 'react';
import { Fire, CloudRain, Smiley, Ghost } from '@phosphor-icons/react';
import { clsx } from 'clsx';

export type Mood = 'adrenaline' | 'cry' | 'laugh' | 'scared' | null;

interface MoodFilterProps {
    selectedMood: Mood;
    onSelectMood: (mood: Mood) => void;
}

const moodColorValues: Record<string, string> = {
    adrenaline: "oklch(0.65 0.18 45)", // Adrenalina (Orange)
    cry: "oklch(0.60 0.15 240)",      // Llorar (Blue)
    laugh: "oklch(0.80 0.18 120)",    // Reír (Yellow/Lime)
    scared: "oklch(0.55 0.18 300)",   // Miedo (Purple)
};

export const MoodFilter: React.FC<MoodFilterProps> = ({ selectedMood, onSelectMood }) => {
    const moods = [
        { id: 'adrenaline', label: 'Adrenalina', icon: Fire },
        { id: 'cry', label: 'Llorar', icon: CloudRain },
        { id: 'laugh', label: 'Reír', icon: Smiley },
        { id: 'scared', label: 'Miedo', icon: Ghost },
    ] as const;

    return (
        <div className="flex w-full overflow-x-auto pb-2 pt-2 no-scrollbar gap-3 md:w-auto md:pb-0">
            {moods.map((mood) => {
                const Icon = mood.icon;
                const isSelected = selectedMood === mood.id;
                const colorValue = moodColorValues[mood.id];

                return (
                    <button
                        key={mood.id}
                        onClick={() => onSelectMood(isSelected ? null : mood.id)}
                        style={{ '--mood-color': colorValue } as React.CSSProperties}
                        className={clsx(
                            "flex flex-shrink-0 items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-all duration-300",
                            isSelected
                                ? "bg-secondary/80 border-[var(--mood-color)] text-[var(--mood-color)] shadow-lg shadow-current/20"
                                : "bg-card border-border text-muted-foreground hover:bg-secondary/20 hover:border-[var(--mood-color)] hover:text-[var(--mood-color)]"
                        )}
                    >
                        <Icon size={18} className="text-current" weight={isSelected ? "fill" : "regular"} />
                        {mood.label}
                    </button>
                );
            })}
        </div>
    );
};
