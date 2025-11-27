import axios from 'axios';
import type { Movie, Video, WatchProvider, CastMember } from '../types';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
    },
    params: {
        language: 'es-ES',
    },
});

export const getPopularMovies = async (page: number = 1): Promise<Movie[]> => {
    const response = await api.get('/movie/popular', {
        params: { page },
    });
    return response.data.results;
};

export const getMoviesByGenre = async (genreId: string, page: number = 1): Promise<Movie[]> => {
    const response = await api.get('/discover/movie', {
        params: {
            with_genres: genreId,
            sort_by: 'popularity.desc',
            page,
        },
    });
    return response.data.results;
};

export const discoverMoviesByYear = async (year: number, page: number = 1): Promise<Movie[]> => {
    const response = await api.get('/discover/movie', {
        params: {
            primary_release_year: year,
            sort_by: 'popularity.desc',
            language: 'es-ES',
            page,
        },
    });
    return response.data.results;
};

export const fetchMovieVideos = async (movieId: number): Promise<Video[]> => {
    const response = await api.get(`/movie/${movieId}/videos`, {
        params: {
            language: 'es-ES',
            include_video_language: 'es,en',
        },
    });
    return response.data.results;
};

export const fetchWatchProviders = async (movieId: number): Promise<{ link: string, flatrate: WatchProvider[], rent: WatchProvider[] }> => {
    const response = await api.get(`/movie/${movieId}/watch/providers`);
    const results = response.data.results;

    // Prioritize DO (Dominican Republic), fallback to US
    const regionData = results['DO'] || results['US'];

    if (!regionData) {
        return { link: '', flatrate: [], rent: [] };
    }

    return {
        link: regionData.link || '',
        flatrate: regionData.flatrate || [],
        rent: regionData.rent || []
    };
};

export const fetchMovieCredits = async (movieId: number): Promise<CastMember[]> => {
    const response = await api.get(`/movie/${movieId}/credits`);
    return response.data.cast;
};

export const fetchSimilarMovies = async (movieId: number): Promise<Movie[]> => {
    const response = await api.get(`/movie/${movieId}/similar`);
    return response.data.results;
};

export const searchMovies = async (query: string, year?: string, page: number = 1): Promise<Movie[]> => {
    const params: Record<string, string | boolean | number> = {
        query,
        include_adult: false,
        language: 'es-ES',
        page,
    };

    if (year) {
        params.primary_release_year = year;
    }

    const response = await api.get('/search/movie', { params });
    return response.data.results;
};
