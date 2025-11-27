import React from 'react';
import { MagnifyingGlass, CircleNotch, Compass, Heart } from '@phosphor-icons/react';
import { YearFilter } from './YearFilter';

interface HeaderProps {
    searchQuery: string;
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    selectedYear: string;
    onYearChange: (year: string) => void;
    view: 'discover' | 'favorites';
    onViewChange: (view: 'discover' | 'favorites') => void;
    isSearching: boolean;
    loading: boolean;
}

export function Header({
    searchQuery,
    onSearchChange,
    selectedYear,
    onYearChange,
    view,
    onViewChange,
    isSearching,
    loading,
}: HeaderProps) {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
            <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-1 md:flex-row md:items-center md:justify-between md:px-8">

                {/* Mobile Top Row: Logo & Nav / Desktop: Split Left & Right */}
                <div className="flex w-full items-center justify-between md:contents">
                    {/* Left: Logo */}
                    <div
                        className="flex flex-shrink-0 cursor-pointer items-center transition-opacity hover:opacity-80 md:order-1"
                        onClick={() => onViewChange('discover')}
                    >
                        <img
                            src="/logo-cinematch.png"
                            alt="CineMatch Logo"
                            className="h-12 md:h-16 w-auto object-contain max-w-none"
                        />
                    </div>

                    {/* Right: Navigation */}
                    <nav className="flex flex-shrink-0 gap-2 md:order-3">
                        <button
                            onClick={() => onViewChange('discover')}
                            className={`group flex items-center gap-2 rounded-lg p-2 px-4 text-sm font-medium transition-all ${view === 'discover'
                                ? 'bg-primary/10 text-primary border border-primary/20'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent'
                                }`}
                            aria-label="Explorar"
                        >
                            <Compass size={20} weight={view === 'discover' ? 'fill' : 'bold'} className="text-current" />
                            <span className="hidden sm:inline">Explorar</span>
                        </button>
                        <button
                            onClick={() => onViewChange('favorites')}
                            className={`group flex items-center gap-2 rounded-lg p-2 px-4 text-sm font-medium transition-all ${view === 'favorites'
                                ? 'bg-primary/10 text-primary border border-primary/20'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent'
                                }`}
                            aria-label="Favoritos"
                        >
                            <Heart size={20} weight={view === 'favorites' ? 'fill' : 'bold'} className="text-current" />
                            <span className="hidden sm:inline">Favoritos</span>
                        </button>
                    </nav>
                </div>

                {/* Center: Search & Filter (Mobile: 2nd Row / Desktop: Center) */}
                <div className="flex w-full items-center gap-2 md:order-2 md:flex-1 md:max-w-xl">
                    <div className="relative w-full">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={onSearchChange}
                            placeholder="Buscar películas..."
                            className="h-12 w-full rounded-full bg-muted/50 pl-11 pr-4 text-base text-foreground placeholder-muted-foreground ring-1 ring-border transition-all focus:bg-muted focus:outline-none focus:ring-2 focus:ring-ring/50 md:h-10 md:text-sm"
                        />
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                            {loading && isSearching ? (
                                <CircleNotch size={18} className="animate-spin text-current" />
                            ) : (
                                <MagnifyingGlass size={18} className="text-current" />
                            )}
                        </div>
                    </div>
                    <YearFilter selectedYear={selectedYear} onChange={onYearChange} />
                </div>

            </div>
        </header>
    );
}
