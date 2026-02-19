import { RecommendedMovie } from '@/types/movie';

export type FeedbackChoice = 'love' | 'skip' | 'not_for_me';

const FEEDBACK_STYLES: Record<FeedbackChoice, { label: string; activeClass: string }> = {
  love: { label: 'Love', activeClass: 'border-emerald-400 bg-emerald-50 text-emerald-700' },
  skip: { label: 'Skip', activeClass: 'border-amber-400 bg-amber-50 text-amber-700' },
  not_for_me: { label: 'Not for me', activeClass: 'border-rose-400 bg-rose-50 text-rose-700' }
};

export function MovieCard({
  movie,
  onAddToWatchlist,
  feedback,
  onSetFeedback,
  onToggleCompare,
  isCompared,
  compareDisabled
}: {
  movie: RecommendedMovie;
  onAddToWatchlist?: (movie: RecommendedMovie) => void;
  feedback?: FeedbackChoice;
  onSetFeedback?: (movieId: number, choice: FeedbackChoice) => void;
  onToggleCompare?: (movie: RecommendedMovie) => void;
  isCompared?: boolean;
  compareDisabled?: boolean;
}) {
  const poster = movie.posterPath
    ? `https://image.tmdb.org/t/p/w500${movie.posterPath}`
    : 'https://placehold.co/500x750/18181b/a1a1aa?text=No+Poster';

  return (
    <article className="group rounded-2xl border border-amber-200 bg-white/90 overflow-hidden transition hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-xl hover:shadow-amber-200/30">
      <img src={poster} alt={movie.title} className="h-80 w-full object-cover transition duration-300 group-hover:scale-[1.02]" />
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold leading-tight">{movie.title}</h3>
          <div className="flex flex-col items-end gap-1">
            <span className="text-xs rounded-full bg-amber-100 px-2 py-1 text-zinc-800">
              TMDB {(movie.voteAverage ?? 0).toFixed(1)}/10
            </span>
            <span className="text-[10px] rounded-full bg-orange-100 px-2 py-1 text-zinc-700">Reco score {movie.score}</span>
          </div>
        </div>
        <p className="text-sm text-zinc-700 line-clamp-3">{movie.overview || 'No overview available.'}</p>
        <p className="text-xs text-orange-700">Why: {movie.why.short}</p>
        <p className="text-xs text-zinc-600">{movie.why.detail}</p>
        {movie.cast && movie.cast.length > 0 && (
          <p className="text-xs text-zinc-700">Cast: {movie.cast.slice(0, 3).map((c) => c.name).join(', ')}</p>
        )}

        {onSetFeedback && (
          <div className="pt-2">
            <p className="mb-1 text-[11px] uppercase tracking-wide text-zinc-500">Quick feedback</p>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(FEEDBACK_STYLES) as FeedbackChoice[]).map((choice) => {
                const isActive = feedback === choice;
                return (
                  <button
                    key={choice}
                    onClick={() => onSetFeedback(movie.id, choice)}
                    className={`rounded-full border px-3 py-1 text-xs transition ${
                      isActive
                        ? FEEDBACK_STYLES[choice].activeClass
                        : 'border-amber-200 bg-white text-zinc-700 hover:border-orange-300 hover:text-orange-700'
                    }`}
                  >
                    {FEEDBACK_STYLES[choice].label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-2 flex flex-wrap gap-2">
          {onAddToWatchlist && (
            <button
              onClick={() => onAddToWatchlist(movie)}
              className="rounded-lg border border-amber-300 px-3 py-1 text-xs text-zinc-800 hover:border-orange-500 hover:text-orange-700"
            >
              + Add to Watchlist
            </button>
          )}
          {onToggleCompare && (
            <button
              onClick={() => onToggleCompare(movie)}
              disabled={!isCompared && compareDisabled}
              className="rounded-lg border border-zinc-300 px-3 py-1 text-xs text-zinc-700 hover:border-orange-400 hover:text-orange-700 disabled:opacity-50"
            >
              {isCompared ? 'Remove from compare' : 'Compare'}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
