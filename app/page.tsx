'use client';

import { useEffect, useMemo, useState } from 'react';
import { GenrePicker } from '@/components/GenrePicker';
import { MovieCard } from '@/components/MovieCard';
import { RecommendedMovie, Movie, ActorConnection } from '@/types/movie';
import { UpcomingMovies } from '@/components/UpcomingMovies';
import { FunFacts } from '@/components/FunFacts';
import { MovieQuiz } from '@/components/MovieQuiz';
import { ActorNetwork } from '@/components/ActorNetwork';
import { WatchlistPanel } from '@/components/WatchlistPanel';
import { GENRES } from '@/lib/recommender';

const WATCHLIST_KEY = 'movie-recs-watchlist';

export default function HomePage() {
  const [favoriteGenres, setFavoriteGenres] = useState<number[]>([878, 53]);
  const [minVoteAverage, setMinVoteAverage] = useState(6.5);
  const [recs, setRecs] = useState<RecommendedMovie[]>([]);
  const [upcoming, setUpcoming] = useState<Movie[]>([]);
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [actorConnections, setActorConnections] = useState<ActorConnection[]>([]);
  const [actorHighlights, setActorHighlights] = useState<Array<{ name: string; appearances: number }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsRefresh, setNeedsRefresh] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(WATCHLIST_KEY);
      if (saved) setWatchlist(JSON.parse(saved));
    } catch {
      // ignore malformed local storage
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
  }, [watchlist]);

  const toggleGenre = (id: number) => {
    setFavoriteGenres((curr) => (curr.includes(id) ? curr.filter((g) => g !== id) : [...curr, id]));
    setNeedsRefresh(true);
  };

  const addToWatchlist = (movie: RecommendedMovie) => {
    setWatchlist((curr) => (curr.some((m) => m.id === movie.id) ? curr : [...curr, movie]));
  };

  const removeFromWatchlist = (id: number) => {
    setWatchlist((curr) => curr.filter((m) => m.id !== id));
  };

  const surpriseMe = () => {
    const genreIds = GENRES.map((g) => g.id);
    const shuffled = [...genreIds].sort(() => Math.random() - 0.5);
    setFavoriteGenres(shuffled.slice(0, 3));
    setMinVoteAverage(Number((5.5 + Math.random() * 2.5).toFixed(1)));
    setNeedsRefresh(true);
  };

  const totalSaved = useMemo(() => watchlist.length, [watchlist]);

  const getRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      const [recRes, upcomingRes] = await Promise.all([
        fetch('/api/recommend', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ favoriteGenres, minVoteAverage })
        }),
        fetch('/api/upcoming', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ favoriteGenres })
        })
      ]);

      const recData = await recRes.json();
      const upcomingData = await upcomingRes.json();

      if (!recRes.ok) throw new Error(recData.error || 'Recommendation request failed');
      if (!upcomingRes.ok) throw new Error(upcomingData.error || 'Upcoming request failed');

      setRecs(recData.recommendations ?? []);
      setActorConnections(recData.actorConnections ?? []);
      setActorHighlights(recData.actorHighlights ?? []);
      setUpcoming(upcomingData.upcoming ?? []);
      setNeedsRefresh(false);
    } catch (e: any) {
      setError(e.message ?? 'Could not fetch recommendations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-8 space-y-8">
      <header className="card-glass rounded-2xl p-6 space-y-3">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">Movie Recs <span className="accent-gold">V1+</span></h1>
          <span className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-300">Watchlist: {totalSaved}</span>
        </div>
        <p className="text-zinc-300">
          Personalized movie picks, upcoming releases, actor connection mapping, and a fun quiz.
        </p>
      </header>

      <section className="card-glass rounded-2xl p-5 space-y-5">
        <div>
          <h2 className="font-semibold mb-2">Favorite Genres</h2>
          <GenrePicker selected={favoriteGenres} onToggle={toggleGenre} />
        </div>

        <div className="max-w-sm">
          <label className="text-sm text-zinc-300 block mb-1">Minimum TMDB Rating: {minVoteAverage.toFixed(1)}/10</label>
          <input
            type="range"
            min={5}
            max={9}
            step={0.1}
            value={minVoteAverage}
            onChange={(e) => {
              setMinVoteAverage(Number(e.target.value));
              setNeedsRefresh(true);
            }}
            className="w-full"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={getRecommendations}
            disabled={loading || favoriteGenres.length === 0}
            className="btn-gold disabled:opacity-60"
          >
            {loading ? 'Building your movie universe...' : 'Recommend for me'}
          </button>
          <button
            onClick={surpriseMe}
            className="rounded-xl border border-zinc-700 px-4 py-2 font-medium text-zinc-200 hover:border-emerald-500"
          >
            Surprise Me
          </button>
        </div>

        {needsRefresh && <p className="text-amber-300 text-xs">Filters changed. Click “Recommend for me” to refresh results.</p>}
        {error && <p className="text-red-400 text-sm">{error}</p>}
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">🍿 Your Recommendations <span className="accent-gold">for tonight</span></h2>
        {recs.length === 0 ? (
          <p className="text-zinc-400 text-sm">No recommendations yet. Click the button above.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recs.map((movie) => (
              <MovieCard key={movie.id} movie={movie} onAddToWatchlist={addToWatchlist} />
            ))}
          </div>
        )}
      </section>

      <WatchlistPanel watchlist={watchlist} onRemove={removeFromWatchlist} />
      <ActorNetwork highlights={actorHighlights} connections={actorConnections} />
      <UpcomingMovies movies={upcoming} />
      <FunFacts />
      <MovieQuiz />
    </main>
  );
}
