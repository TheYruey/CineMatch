import { useState, useEffect, useCallback } from 'react';
import { getPopularMovies, getMoviesByGenre, searchMovies, discoverMoviesByYear } from './services/api';
import { MovieGrid } from './components/MovieGrid';
import { MoodFilter, type Mood } from './components/MoodFilter';
import { MovieModal } from './components/MovieModal';
import { ShuffleButton } from './components/ShuffleButton';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { useFavorites } from './hooks/useFavorites';
import { useDebounce } from './hooks/useDebounce';
import { useIntersectionObserver } from './hooks/useIntersectionObserver';
import type { Movie } from './types';

// Genre IDs mapping
const MOOD_GENRES: Record<string, string> = {
  adrenaline: '28,12', // Action, Adventure
  cry: '18,10749',     // Drama, Romance
  laugh: '35',         // Comedy
  scared: '27',        // Horror
};

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMood, setSelectedMood] = useState<Mood>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [view, setView] = useState<'discover' | 'favorites'>('discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [autoLoadCount, setAutoLoadCount] = useState(0);

  const debouncedSearchTerm = useDebounce(searchQuery, 500);
  const { favorites } = useFavorites();

  const fetchMovies = useCallback(async (currentPage: number) => {
    if (view === 'favorites') return;

    setLoading(true);
    try {
      let results: Movie[] = [];

      // Escenario A: Búsqueda + Año
      if (debouncedSearchTerm && selectedYear) {
        results = await searchMovies(debouncedSearchTerm, selectedYear, currentPage);
      }
      // Escenario C: Solo Búsqueda
      else if (debouncedSearchTerm && !selectedYear) {
        results = await searchMovies(debouncedSearchTerm, undefined, currentPage);
      }
      // Escenario B: Solo Año
      else if (!debouncedSearchTerm && selectedYear) {
        results = await discoverMoviesByYear(Number(selectedYear), currentPage);
      }
      // Escenario D: Default (Mood o Populares)
      else {
        if (selectedMood && MOOD_GENRES[selectedMood]) {
          results = await getMoviesByGenre(MOOD_GENRES[selectedMood], currentPage);
        } else {
          results = await getPopularMovies(currentPage);
        }
      }

      if (results.length === 0) {
        setHasMore(false);
      } else {
        setMovies(prev => {
          if (currentPage === 1) return results;
          // Filter duplicates
          const newMovies = results.filter(m => !prev.some(pm => pm.id === m.id));
          return [...prev, ...newMovies];
        });
        setAutoLoadCount(prev => prev + 1);
      }
    } catch (error: unknown) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedMood, view, debouncedSearchTerm, selectedYear]);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setAutoLoadCount(0);
    setMovies([]); // Clear movies on filter change
    fetchMovies(1);
  }, [selectedMood, view, debouncedSearchTerm, selectedYear]); // Removed fetchMovies from dependency to avoid loop, but fetchMovies depends on these anyway. Ideally we call it here.

  useEffect(() => {
    if (page > 1) {
      fetchMovies(page);
    }
  }, [page, fetchMovies]);

  const handleObserver = useCallback(() => {
    if (!loading && hasMore && view === 'discover') {
      setPage(prev => prev + 1);
    }
  }, [loading, hasMore, view]);

  const sentryRef = useIntersectionObserver(handleObserver);

  const handleShuffle = () => {
    const listToShuffle = view === 'favorites' ? favorites : movies;
    if (listToShuffle.length > 0) {
      const randomIndex = Math.floor(Math.random() * listToShuffle.length);
      setSelectedMovie(listToShuffle[randomIndex]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value) {
      setIsSearching(true);
      setSelectedMood(null); // Clear mood on search
    } else {
      setIsSearching(false);
    }
  };

  const handleMoodSelect = (mood: Mood) => {
    setSelectedMood(mood);
    if (mood) {
      setIsSearching(false);
      setSearchQuery('');
      setSelectedYear(''); // Clear year when mood is selected
    }
  };

  const handleYearSelect = (year: string) => {
    setSelectedYear(year);
    if (year) {
      setSelectedMood(null); // Clear mood when year is selected
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return "Buenos días, cinéfilo ☀️";
    if (hour >= 12 && hour < 19) return "Buenas tardes 🌤️";
    return "Noche de película 🍿";
  };

  const getSectionTitle = () => {
    if (view === 'favorites') return 'Mis Favoritos';

    if (debouncedSearchTerm) {
      if (selectedYear) return `Resultados para "${debouncedSearchTerm}" en ${selectedYear}`;
      return `Resultados para "${debouncedSearchTerm}"`;
    }

    if (selectedYear) {
      return `Lo mejor de ${selectedYear} 📅`;
    }

    if (selectedMood) {
      const titles: Record<string, string> = {
        adrenaline: "Explosiones y Velocidad 💥",
        cry: "Prepara los pañuelos 😢",
        laugh: "Risas garantizadas 😂",
        scared: "No apagues la luz... 👻",
      };
      return titles[selectedMood] || 'Recomendaciones para ti';
    }

    return 'Tendencias de hoy 🔥';
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
      <Header
        searchQuery={searchQuery}
        onSearchChange={handleInputChange}
        selectedYear={selectedYear}
        onYearChange={handleYearSelect}
        view={view}
        onViewChange={setView}
        isSearching={isSearching}
        loading={loading}
      />

      <main className="container mx-auto px-4 py-6 flex-grow">
        <div className="mt-8">
          {view === 'discover' && !isSearching && !selectedMood && !selectedYear && (
            <div className="mb-2 animate-fade-in-up">
              <h1 className="text-4xl font-bold tracking-tight mb-2 text-foreground">
                {getGreeting()}
              </h1>
              <p className="text-xl font-medium opacity-90 text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                ¿No sabes qué ver? Deja que el azar decida por ti.
              </p>
            </div>
          )}

          <div className="mt-4 mb-6 flex flex-col items-start gap-4 border-b border-border pb-2 md:flex-row md:items-end md:justify-between">
            <h2 className="text-2xl font-bold text-foreground">
              {getSectionTitle()}
            </h2>

            {view === 'discover' && (
              <MoodFilter
                selectedMood={selectedMood}
                onSelectMood={handleMoodSelect}
              />
            )}
          </div>

          {view === 'favorites' && favorites.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground mb-2">Aún no has guardado películas.</p>
              <p className="text-muted-foreground">Ve a explorar y marca algunas con ❤️</p>
            </div>
          ) : view === 'discover' && (isSearching || selectedYear) && movies.length === 0 && !loading ? (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground mb-2">Ups, no encontramos esa película. 😿</p>
              <p className="text-muted-foreground">¿Quizás un documental de gatos?</p>
            </div>
          ) : (
            <MovieGrid
              movies={view === 'favorites' ? favorites : movies}
              loading={view === 'discover' ? loading && page === 1 : false}
              onMovieClick={setSelectedMovie}
            />
          )}

          {/* Sentinel for Infinite Scroll - Only active if autoLoadCount < 3 */}
          {view === 'discover' && hasMore && autoLoadCount < 3 && (
            <div ref={sentryRef} className="h-10 flex justify-center items-center mt-4">
              {loading && page > 1 && (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              )}
            </div>
          )}

          {/* Manual Load Button - Active if autoLoadCount >= 3 */}
          {view === 'discover' && hasMore && autoLoadCount >= 3 && (
            <div className="flex justify-center mt-8 mb-4">
              <button
                onClick={() => setPage(prev => prev + 1)}
                disabled={loading}
                className="w-full md:w-auto px-8 py-3 rounded-full border border-border hover:bg-secondary transition-colors font-medium text-foreground disabled:opacity-50"
              >
                {loading ? 'Cargando...' : 'Cargar más películas'}
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />

      <ShuffleButton onClick={handleShuffle} />

      <MovieModal
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
        onMovieSelect={setSelectedMovie}
      />
    </div>
  );
}

export default App;
