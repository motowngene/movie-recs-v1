'use client';

import { useEffect, useMemo, useState } from 'react';
import { GenrePicker } from '@/components/GenrePicker';
import { MovieCard, FeedbackChoice } from '@/components/MovieCard';
import { RecommendedMovie, Movie, ActorConnection } from '@/types/movie';
import { UpcomingMovies } from '@/components/UpcomingMovies';
import { FunFacts } from '@/components/FunFacts';
import { MovieQuiz } from '@/components/MovieQuiz';
import { ActorNetwork } from '@/components/ActorNetwork';
import { WatchlistPanel } from '@/components/WatchlistPanel';
import { MovieCompare } from '@/components/MovieCompare';
import { EditorPicksCarousel } from '@/components/EditorPicksCarousel';
import { BecauseYouLiked } from '@/components/BecauseYouLiked';
import { GENRES } from '@/lib/recommender';

const WATCHLIST_KEY = 'movie-recs-watchlist';
const FEEDBACK_KEY = 'movie-recs-feedback';

export default function HomePage() {
  const [favoriteGenres, setFavoriteGenres] = useState<number[]>([878, 53]);
  const [minVoteAverage, setMinVoteAverage] = useState(6.5);
  const [upcomingTimeframeDays, setUpcomingTimeframeDays] = useState<30 | 90 | 180>(90);
  const [recs, setRecs] = useState<RecommendedMovie[]>([]);
  const [upcoming, setUpcoming] = useState<Movie[]>([]);
  const [editorPicks, setEditorPicks] = useState<Movie[]>([]);
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [feedbackByMovie, setFeedbackByMovie] = useState<Record<number, FeedbackChoice>>({});
  const [compareSelection, setCompareSelection] = useState<Movie[]>([]);
  const [actorConnections, setActorConnections] = useState<ActorConnection[]>([]);
  const [actorHighlights, setActorHighlights] = useState<Array<{ name: string; appearances: number }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsRefresh, setNeedsRefresh] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(WATCHLIST_KEY);
      if (saved) setWatchlist(JSON.parse(saved));
      const savedFeedback = localStorage.getItem(FEEDBACK_KEY);
      if (savedFeedback) setFeedbackByMovie(JSON.parse(savedFeedback));
    } catch {
      // ignore malformed local storage
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify(feedbackByMovie));
  }, [feedbackByMovie]);

  const toggleGenre = (id: number) => {
    setFavoriteGenres((curr) => (curr.includes(id) ? curr.filter((g) => g !== id) : [...curr, id]));
    setNeedsRefresh(true);
  };

  const addToWatchlist = (movie: RecommendedMovie) => {
    setWatchlist((curr) => (curr.some((m) => m.id === movie.id) ? curr : [...curr, movie]));
  };

  const removeFromWatchlist = (id: number) => {
    setWatchlist((curr) => curr.filter((m) => m.id !== id));
    setCompareSelection((curr) => curr.filter((m) => m.id !== id));
  };

  const setFeedback = (movieId: number, choice: FeedbackChoice) => {
    setFeedbackByMovie((curr) => ({ ...curr, [movieId]: choice }));
  };

  const toggleCompare = (movie: Movie) => {
    setCompareSelection((curr) => {
      const exists = curr.some((m) => m.id === movie.id);
      if (exists) return curr.filter((m) => m.id !== movie.id);
      if (curr.length >= 3) return curr;
      return [...curr, movie];
    });
  };

  const surpriseMe = () => {
    const genreIds = GENRES.map((g) => g.id);
    const shuffled = [...genreIds].sort(() => Math.random() - 0.5);
    setFavoriteGenres(shuffled.slice(0, 3));
    setMinVoteAverage(Number((5.5 + Math.random() * 2.5).toFixed(1)));
    setNeedsRefresh(true);
  };

  const totalSaved = useMemo(() => watchlist.length, [watchlist]);
  const comparedIds = useMemo(() => compareSelection.map((m) => m.id), [compareSelection]);

  // editor picks loaded from API

  const becauseYouLiked = useMemo(() => {
    const genreNameById = new Map(GENRES.map((genre) => [genre.id, genre.name]));

    return favoriteGenres.slice(0, 3).map((genreId) => {
      const genreName = genreNameById.get(genreId) ?? 'this vibe';
      const representativeMovie = recs.find((movie) => movie.genreIds?.includes(genreId));
      return {
        title: genreName,
        detail: representativeMovie
          ? `Because you leaned into ${genreName.toLowerCase()}, we surfaced ${representativeMovie.title} and similar titles with strong overlap in tone, cast, and audience response.`
          : `You keep coming back to ${genreName.toLowerCase()}, so we prioritize picks with a matching pace, mood, and rewatch potential.`
      };
    });
  }, [favoriteGenres, recs]);

  const getRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      const [recRes, upcomingRes, editorRes] = await Promise.all([
        fetch('/api/recommend', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ favoriteGenres, minVoteAverage })
        }),
        fetch('/api/upcoming', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ favoriteGenres, timeframeDays: upcomingTimeframeDays })
        }),
        fetch('/api/editor-picks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ favoriteGenres })
        })
      ]);

      const recData = await recRes.json();
      const upcomingData = await upcomingRes.json();
      const editorData = await editorRes.json();

      if (!recRes.ok) throw new Error(recData.error || 'Recommendation request failed');
      if (!upcomingRes.ok) throw new Error(upcomingData.error || 'Upcoming request failed');
      if (!editorRes.ok) throw new Error(editorData.error || 'Editor picks request failed');

      setRecs(recData.recommendations ?? []);
      setActorConnections(recData.actorConnections ?? []);
      setActorHighlights(recData.actorHighlights ?? []);
      setUpcoming(upcomingData.upcoming ?? []);
      setEditorPicks(editorData.editorPicks ?? []);
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
          <h1 className="text-3xl font-bold tracking-tight">Movie Recs <span className="accent-gold">V1+</span></h1>
          <span className="rounded-full border border-amber-300 px-3 py-1 text-xs text-zinc-700">Watchlist: {totalSaved}</span>
        </div>
        <p className="text-zinc-700">
          Personalized movie picks, upcoming release radar, actor connection mapping, and a fun quiz.
        </p>
      </header>

      <section className="card-glass rounded-2xl p-5 space-y-5">
        <div>
          <h2 className="font-semibold mb-2">Favorite Genres</h2>
          <GenrePicker selected={favoriteGenres} onToggle={toggleGenre} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="max-w-sm">
            <label className="text-sm text-zinc-700 block mb-1">Minimum TMDB Rating: {minVoteAverage.toFixed(1)}/10</label>
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

          <div className="max-w-sm">
            <label className="text-sm text-zinc-700 block mb-1">Upcoming radar timeframe</label>
            <select
              value={upcomingTimeframeDays}
              onChange={(e) => {
                setUpcomingTimeframeDays(Number(e.target.value) as 30 | 90 | 180);
                setNeedsRefresh(true);
              }}
              className="w-full rounded-lg border border-amber-300 bg-white px-3 py-2 text-sm text-zinc-800"
            >
              <option value={30}>Next 30 days</option>
              <option value={90}>Next 90 days</option>
              <option value={180}>Next 180 days</option>
            </select>
          </div>
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
            className="rounded-xl border border-amber-300 px-4 py-2 font-medium text-zinc-800 hover:border-orange-500 hover:text-orange-700"
          >
            Surprise Me
          </button>
        </div>

        {needsRefresh && <p className="text-orange-700 text-xs">Filters changed. Click “Recommend for me” to refresh results.</p>}
        {error && <p className="text-red-600 text-sm">{error}</p>}
      </section>

      <EditorPicksCarousel movies={editorPicks} />
      <BecauseYouLiked reasons={becauseYouLiked} />

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">🍿 Your Recommendations <span className="accent-gold">for tonight</span></h2>
        {recs.length === 0 ? (
          <p className="text-zinc-600 text-sm">No recommendations yet. Click the button above.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recs.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onAddToWatchlist={addToWatchlist}
                onToggleCompare={toggleCompare}
                isCompared={comparedIds.includes(movie.id)}
                compareDisabled={compareSelection.length >= 3}
                feedback={feedbackByMovie[movie.id]}
                onSetFeedback={setFeedback}
              />
            ))}
          </div>
        )}
      </section>

      <MovieCompare selected={compareSelection} onRemove={(id) => setCompareSelection((curr) => curr.filter((m) => m.id !== id))} />
      <WatchlistPanel
        watchlist={watchlist}
        onRemove={removeFromWatchlist}
        onToggleCompare={toggleCompare}
        comparedIds={comparedIds}
        compareDisabled={compareSelection.length >= 3}
      />
      <ActorNetwork highlights={actorHighlights} connections={actorConnections} />
      <UpcomingMovies movies={upcoming} timeframeDays={upcomingTimeframeDays} />
      <FunFacts />
      <MovieQuiz />
    </main>
  );
}
