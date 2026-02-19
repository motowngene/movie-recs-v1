import { Movie } from '@/types/movie';

export function MovieCompare({
  selected,
  onRemove
}: {
  selected: Movie[];
  onRemove: (id: number) => void;
}) {
  if (!selected.length) {
    return (
      <section className="card-glass rounded-2xl p-5 space-y-2">
        <h2 className="text-xl font-semibold">🧪 Compare View</h2>
        <p className="text-sm text-zinc-600">Select up to 3 movies from recommendations or your watchlist to compare details side-by-side.</p>
      </section>
    );
  }

  return (
    <section className="card-glass rounded-2xl p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">🧪 Compare View</h2>
        <p className="text-xs text-zinc-600">{selected.length}/3 selected</p>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        {selected.map((movie) => (
          <article key={movie.id} className="rounded-xl border border-amber-200 bg-white/80 p-3 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-medium leading-tight">{movie.title}</h3>
              <button
                onClick={() => onRemove(movie.id)}
                className="text-xs text-zinc-500 hover:text-rose-600"
              >
                Remove
              </button>
            </div>
            <p className="text-xs text-zinc-700">⭐ TMDB {(movie.voteAverage ?? 0).toFixed(1)}/10</p>
            <p className="text-xs text-zinc-700">📅 Release: {movie.releaseDate || 'TBA'}</p>
            <p className="text-sm text-zinc-700 line-clamp-4">{movie.overview || 'No overview available.'}</p>
            {'cast' in movie && Array.isArray((movie as any).cast) && (movie as any).cast.length > 0 && (
              <p className="text-xs text-zinc-600">
                🎭 Cast preview: {(movie as any).cast.slice(0, 3).map((c: { name: string }) => c.name).join(', ')}
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
