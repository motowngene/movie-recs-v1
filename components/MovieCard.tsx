import { RecommendedMovie } from '@/types/movie';

export function MovieCard({
  movie,
  onAddToWatchlist
}: {
  movie: RecommendedMovie;
  onAddToWatchlist?: (movie: RecommendedMovie) => void;
}) {
  const poster = movie.posterPath
    ? `https://image.tmdb.org/t/p/w500${movie.posterPath}`
    : 'https://placehold.co/500x750/18181b/a1a1aa?text=No+Poster';

  return (
    <article className="rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
      <img src={poster} alt={movie.title} className="h-80 w-full object-cover" />
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold leading-tight">{movie.title}</h3>
          <div className="flex flex-col items-end gap-1">
            <span className="text-xs rounded-full bg-zinc-800 px-2 py-1">
              TMDB {(movie.voteAverage ?? 0).toFixed(1)}/10
            </span>
            <span className="text-[10px] rounded-full bg-zinc-800/70 px-2 py-1 text-zinc-300">
              Reco score {movie.score}
            </span>
          </div>
        </div>
        <p className="text-sm text-zinc-300 line-clamp-3">{movie.overview || 'No overview available.'}</p>
        <p className="text-xs text-emerald-300">Why: {movie.why.short}</p>
        <p className="text-xs text-zinc-400">{movie.why.detail}</p>
        {movie.cast && movie.cast.length > 0 && (
          <p className="text-xs text-zinc-300">
            Cast: {movie.cast.slice(0, 3).map((c) => c.name).join(', ')}
          </p>
        )}
        {onAddToWatchlist && (
          <button
            onClick={() => onAddToWatchlist(movie)}
            className="mt-2 rounded-lg border border-zinc-700 px-3 py-1 text-xs text-zinc-200 hover:border-emerald-500 hover:text-emerald-300"
          >
            + Add to Watchlist
          </button>
        )}
      </div>
    </article>
  );
}
