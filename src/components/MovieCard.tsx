import React from 'react';
import { Heart } from '@phosphor-icons/react';
import type { Movie } from '../types';
import { useFavorites } from '../hooks/useFavorites';

interface MovieCardProps {
    movie: Movie;
    onClick: (movie: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick }) => {
    const { isFavorite, toggleFavorite } = useFavorites();
    const isFav = isFavorite(movie.id);

    const imageUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : 'https://via.placeholder.com/500x750?text=No+Image';

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        toggleFavorite(movie);
    };

    return (
        <div
            onClick={() => onClick(movie)}
            className="group relative aspect-[2/3] cursor-pointer overflow-hidden rounded-xl bg-card transition-all duration-500 ease-out hover:-translate-y-2 animate-fade-in-up"
        >
            <div className="aspect-[2/3] w-full overflow-hidden">
                <img
                    src={imageUrl}
                    alt={movie.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                />
            </div>

            {/* Rating Badge */}
            <div className="absolute left-2 top-2 z-10 rounded-md bg-secondary/90 px-2 py-1 text-xs font-bold text-secondary-foreground shadow-sm backdrop-blur-sm">
                {movie.vote_average.toFixed(1)}
            </div>

            {/* Favorite Button */}
            <button
                onClick={handleFavoriteClick}
                className="absolute right-2 top-2 z-10 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm transition-all hover:bg-white hover:text-primary active:scale-95"
            >
                <Heart
                    size={18}
                    weight={isFav ? "fill" : "bold"}
                    className={isFav ? "text-primary" : "text-current"}
                />
            </button>

            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 pt-16 opacity-100 transition-opacity duration-300">
                <h3 className="line-clamp-1 text-lg font-bold text-white group-hover:text-primary transition-colors">{movie.title}</h3>
                <div className="mt-1 flex items-center justify-between text-sm text-muted-foreground">
                    <span>{movie.release_date?.split('-')[0]}</span>
                </div>
            </div>
        </div>
    );
};
