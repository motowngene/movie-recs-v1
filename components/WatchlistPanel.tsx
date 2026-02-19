import { Movie } from '@/types/movie';

export function WatchlistPanel({
  watchlist,
  onRemove,
  onToggleCompare,
  comparedIds,
  compareDisabled
}: {
  watchlist: Movie[];
  onRemove: (id: number) => void;
  onToggleCompare?: (movie: Movie) => void;
  comparedIds?: number[];
  compareDisabled?: boolean;
}) {
  return (
    <section className="card-glass rounded-2xl p-5 space-y-3">
      <h2 className="text-xl font-semibold">⭐ Your Watchlist</h2>
      {watchlist.length === 0 ? (
        <p className="text-sm text-zinc-600">No saved movies yet. Add titles from recommendations.</p>
      ) : (
        <ul className="space-y-2">
          {watchlist.map((movie) => {
            const isCompared = comparedIds?.includes(movie.id);
            return (
              <li key={movie.id} className="flex items-center justify-between rounded-lg border border-amber-200 bg-white/70 p-2 gap-2">
                <div>
                  <p className="text-sm font-medium">{movie.title}</p>
                  <p className="text-xs text-zinc-600">TMDB {(movie.voteAverage ?? 0).toFixed(1)}/10</p>
                </div>
                <div className="flex gap-2">
                  {onToggleCompare && (
                    <button
                      onClick={() => onToggleCompare(movie)}
                      disabled={!isCompared && compareDisabled}
                      className="rounded-md border border-zinc-300 px-2 py-1 text-xs text-zinc-700 hover:border-orange-400 hover:text-orange-700 disabled:opacity-50"
                    >
                      {isCompared ? 'Compared' : 'Compare'}
                    </button>
                  )}
                  <button
                    onClick={() => onRemove(movie.id)}
                    className="rounded-md border border-zinc-300 px-2 py-1 text-xs text-zinc-700 hover:border-red-500 hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
