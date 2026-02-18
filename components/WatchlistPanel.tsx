import { Movie } from '@/types/movie';

export function WatchlistPanel({
  watchlist,
  onRemove
}: {
  watchlist: Movie[];
  onRemove: (id: number) => void;
}) {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-3">
      <h2 className="text-xl font-semibold">⭐ Your Watchlist</h2>
      {watchlist.length === 0 ? (
        <p className="text-sm text-zinc-400">No saved movies yet. Add titles from recommendations.</p>
      ) : (
        <ul className="space-y-2">
          {watchlist.map((movie) => (
            <li key={movie.id} className="flex items-center justify-between rounded-lg border border-zinc-800 p-2">
              <div>
                <p className="text-sm font-medium">{movie.title}</p>
                <p className="text-xs text-zinc-400">TMDB {(movie.voteAverage ?? 0).toFixed(1)}/10</p>
              </div>
              <button
                onClick={() => onRemove(movie.id)}
                className="rounded-md border border-zinc-700 px-2 py-1 text-xs text-zinc-300 hover:border-red-500 hover:text-red-300"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
