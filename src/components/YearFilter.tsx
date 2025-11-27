import { useState, useRef, useEffect } from 'react';
import { CaretDown, X } from '@phosphor-icons/react';

interface YearFilterProps {
    selectedYear: string;
    onChange: (year: string) => void;
}

export function YearFilter({ selectedYear, onChange }: YearFilterProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange('');
        setIsOpen(false);
    };

    const years = Array.from({ length: 46 }, (_, i) => 2025 - i);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 font-medium transition-colors ${selectedYear
                    ? 'bg-white text-neutral-950'
                    : 'bg-neutral-900/50 text-neutral-400 hover:bg-neutral-900 hover:text-white'
                    }`}
            >
                <span>{selectedYear || 'Año'}</span>
                {selectedYear ? (
                    <div
                        role="button"
                        onClick={handleClear}
                        className="rounded-full p-0.5 hover:bg-black/10"
                    >
                        <X size={14} />
                    </div>
                ) : (
                    <CaretDown size={16} />
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 max-h-60 w-32 overflow-y-auto rounded-xl bg-neutral-900 py-2 shadow-xl ring-1 ring-white/10 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent">
                    <button
                        onClick={() => {
                            onChange('');
                            setIsOpen(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-neutral-800 ${!selectedYear ? 'text-white font-medium' : 'text-neutral-400'
                            }`}
                    >
                        Todos
                    </button>
                    {years.map((year) => (
                        <button
                            key={year}
                            onClick={() => {
                                onChange(year.toString());
                                setIsOpen(false);
                            }}
                            className={`w-full px-4 py-2 text-left text-sm hover:bg-neutral-800 ${selectedYear === year.toString()
                                ? 'text-white font-medium'
                                : 'text-neutral-400'
                                }`}
                        >
                            {year}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
