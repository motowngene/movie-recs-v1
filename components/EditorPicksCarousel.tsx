import { Movie } from '@/types/movie';

export function EditorPicksCarousel({ movies }: { movies: Movie[] }) {
  if (movies.length === 0) return null;

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">✨ Editor Picks</h2>
        <span className="text-xs text-zinc-500">Handpicked for a cozy movie night</span>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {movies.map((movie) => {
          const poster = movie.posterPath
            ? `https://image.tmdb.org/t/p/w500${movie.posterPath}`
            : 'https://placehold.co/500x750/18181b/a1a1aa?text=No+Poster';

          return (
            <article
              key={movie.id}
              className="min-w-[220px] max-w-[220px] rounded-2xl border border-amber-200 bg-white/90 p-3 shadow-sm"
            >
              <img src={poster} alt={movie.title} className="h-56 w-full rounded-xl object-cover" />
              <div className="pt-2 space-y-1">
                <h3 className="text-sm font-semibold line-clamp-1">{movie.title}</h3>
                <p className="text-xs text-zinc-600 line-clamp-2">{movie.overview || 'A thoughtful pick from our editorial team.'}</p>
                <p className="text-[11px] text-orange-700">A warm pick for your current taste profile.</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
