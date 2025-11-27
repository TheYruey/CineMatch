import React, { useEffect, useState } from 'react';
import { X, Star, CalendarBlank, Heart } from '@phosphor-icons/react';
import { fetchMovieVideos, fetchWatchProviders, fetchMovieCredits, fetchSimilarMovies } from '../services/api';
import { useFavorites } from '../hooks/useFavorites';
import type { Movie, WatchProvider, CastMember } from '../types';

interface MovieModalProps {
    movie: Movie | null;
    onClose: () => void;
    onMovieSelect: (movie: Movie) => void;
}

export const MovieModal: React.FC<MovieModalProps> = ({ movie, onClose, onMovieSelect }) => {
    const [trailerKey, setTrailerKey] = useState<string | null>(null);
    const [providers, setProviders] = useState<{ link: string, flatrate: WatchProvider[], rent: WatchProvider[] }>({ link: '', flatrate: [], rent: [] });
    const [cast, setCast] = useState<CastMember[]>([]);
    const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
    const [loadingProviders, setLoadingProviders] = useState(false);
    const { isFavorite, toggleFavorite } = useFavorites();
    const isFav = movie ? isFavorite(movie.id) : false;

    useEffect(() => {
        let isMounted = true;

        if (movie) {
            void fetchMovieVideos(movie.id).then((videos) => {
                if (isMounted) {
                    const trailer = videos.find((v) => v.site === 'YouTube' && v.type === 'Trailer');
                    setTrailerKey(trailer ? trailer.key : null);
                }
            });

            // eslint-disable-next-line react-hooks/exhaustive-deps
            setLoadingProviders(true);
            void fetchWatchProviders(movie.id).then((data) => {
                if (isMounted) {
                    setProviders(data);
                    setLoadingProviders(false);
                }
            }).catch(() => {
                if (isMounted) setLoadingProviders(false);
            });

            void fetchMovieCredits(movie.id).then((data) => {
                if (isMounted) setCast(data.slice(0, 8));
            });

            void fetchSimilarMovies(movie.id).then((data) => {
                if (isMounted) setSimilarMovies(data.slice(0, 6));
            });
        } else {
            setTrailerKey(null);
            setProviders({ link: '', flatrate: [], rent: [] });
            setCast([]);
            setSimilarMovies([]);
        }

        return () => {
            isMounted = false;
        };
    }, [movie?.id]);

    if (!movie) return null;

    const backdropUrl = movie.backdrop_path
        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
        : `https://image.tmdb.org/t/p/original${movie.poster_path}`;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-card text-card-foreground shadow-2xl animate-in zoom-in-95 duration-200 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent border border-white/10"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 z-50 rounded-full bg-black/40 p-2 text-white backdrop-blur-md transition-colors hover:bg-white hover:text-black"
                >
                    <X size={24} />
                </button>

                {/* Hero Image Section */}
                <div className="relative h-[40vh] w-full">
                    <img
                        src={backdropUrl}
                        alt={movie.title}
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/80 to-transparent" />

                    {/* Title Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-8 pb-4">
                        <h2 className="text-4xl font-bold text-white leading-tight drop-shadow-lg">{movie.title}</h2>
                    </div>
                </div>

                {/* Content Section */}
                <div className="px-8 pb-8 pt-2">
                    {/* Metadata Row */}
                    <div className="flex items-center gap-6 text-muted-foreground mb-6">
                        <span className="flex items-center gap-2 text-yellow-500 font-semibold">
                            <Star size={20} weight="fill" />
                            {movie.vote_average.toFixed(1)}
                        </span>
                        <span className="flex items-center gap-2">
                            <CalendarBlank size={20} />
                            {movie.release_date?.split('-')[0]}
                        </span>
                        {/* Placeholder for runtime if available in future */}
                        {/* <span className="flex items-center gap-2">
                            <Clock size={20} />
                            2h 15m
                        </span> */}

                        <button
                            onClick={() => toggleFavorite(movie)}
                            className="ml-auto flex items-center gap-2 rounded-full bg-secondary/20 px-4 py-1.5 text-sm font-medium text-secondary-foreground hover:bg-secondary/40 transition-colors"
                        >
                            <Heart
                                size={18}
                                weight={isFav ? "fill" : "regular"}
                                className={isFav ? "text-red-500" : "text-current"}
                            />
                            {isFav ? 'Guardado' : 'Guardar'}
                        </button>
                    </div>

                    {/* Synopsis */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-foreground mb-2">Sinopsis</h3>
                        <p className="text-lg leading-relaxed text-muted-foreground">
                            {movie.overview || "No hay sinopsis disponible."}
                        </p>
                    </div>

                    {/* Trailer */}
                    {trailerKey && (
                        <div className="mb-8 overflow-hidden rounded-xl shadow-lg border border-white/5 bg-black">
                            <iframe
                                className="w-full aspect-video"
                                src={`https://www.youtube.com/embed/${trailerKey}`}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    )}

                    {/* Streaming Availability Section */}
                    <div className="mb-4">
                        {!loadingProviders && providers.flatrate.length === 0 && providers.rent.length === 0 ? (
                            <p className="text-sm text-muted-foreground italic">No disponible en streaming por ahora</p>
                        ) : (
                            <div className="space-y-6">
                                {providers.flatrate.length > 0 && (
                                    <div>
                                        <h3 className="text-xs font-bold text-muted-foreground mb-3 uppercase tracking-wider">Stream</h3>
                                        <div className="flex flex-wrap gap-4">
                                            {providers.flatrate.map((provider) => (
                                                <a
                                                    key={provider.provider_id}
                                                    href={providers.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="group relative transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary rounded-xl"
                                                >
                                                    <img
                                                        src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                                                        alt={provider.provider_name}
                                                        title={provider.provider_name}
                                                        className="w-12 h-12 rounded-xl shadow-lg group-hover:shadow-primary/20 transition-all duration-300"
                                                    />
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {providers.rent.length > 0 && (
                                    <div>
                                        <h3 className="text-xs font-bold text-muted-foreground mb-3 uppercase tracking-wider">Alquilar</h3>
                                        <div className="flex flex-wrap gap-4">
                                            {providers.rent.map((provider) => (
                                                <a
                                                    key={provider.provider_id}
                                                    href={providers.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="group relative transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary rounded-xl"
                                                >
                                                    <img
                                                        src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                                                        alt={provider.provider_name}
                                                        title={provider.provider_name}
                                                        className="w-12 h-12 rounded-xl shadow-lg group-hover:shadow-primary/20 transition-all duration-300"
                                                    />
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Top Cast Section */}
                    {cast.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-foreground mb-4">Reparto Principal</h3>
                            <div className="flex overflow-x-auto gap-4 pb-4 snap-x scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent">
                                {cast.map((actor) => (
                                    <div key={actor.id} className="flex flex-col items-center text-center min-w-[100px] snap-start">
                                        <img
                                            src={actor.profile_path ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` : 'https://via.placeholder.com/150?text=No+Image'}
                                            alt={actor.name}
                                            className="w-20 h-20 rounded-full object-cover mb-2 shadow-md"
                                        />
                                        <p className="text-sm font-medium text-foreground line-clamp-1">{actor.name}</p>
                                        <p className="text-xs text-muted-foreground line-clamp-1">{actor.character}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Similar Movies Section */}
                    {similarMovies.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-foreground mb-4">Películas Similares</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {similarMovies.map((similar) => (
                                    <div
                                        key={similar.id}
                                        className="group relative cursor-pointer rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105"
                                        onClick={() => onMovieSelect(similar)}
                                    >
                                        <div className="aspect-[2/3] w-full bg-neutral-800">
                                            <img
                                                src={similar.poster_path ? `https://image.tmdb.org/t/p/w500${similar.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Poster'}
                                                alt={similar.title}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                                            <p className="text-sm font-bold text-white line-clamp-2">{similar.title}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
