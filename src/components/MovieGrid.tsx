import React from 'react';
import { MovieCard } from './MovieCard';
import type { Movie } from '../types';

interface MovieGridProps {
    movies: Movie[];
    onMovieClick: (movie: Movie) => void;
    loading?: boolean;
}

export const MovieGrid: React.FC<MovieGridProps> = ({ movies, onMovieClick, loading }) => {
    if (loading) {
        return (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {[...Array(10)].map((_, i) => (
                    <div key={i} className="aspect-[2/3] animate-pulse rounded-xl bg-neutral-800/50" />
                ))}
            </div>
        );
    }

    if (movies.length === 0) {
        return (
            <div className="flex h-64 items-center justify-center text-center text-neutral-400">
                <p>No se encontraron películas para este estado de ánimo.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {movies.map((movie) => (
                <MovieCard
                    key={movie.id}
                    movie={movie}
                    onClick={onMovieClick}
                />
            ))}
        </div>
    );
};
