import { Movie } from '@/types/movie';

export function UpcomingMovies({ movies, timeframeDays }: { movies: Movie[]; timeframeDays: number }) {
  if (!movies.length) return null;

  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold">🚀 Upcoming Radar ({timeframeDays} days)</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {movies.slice(0, 6).map((movie) => (
          <article key={movie.id} className="card-glass rounded-xl p-3">
            <h3 className="font-medium">{movie.title}</h3>
            <p className="text-xs text-zinc-600 mt-1">Release: {movie.releaseDate || 'TBA'} · TMDB {(movie.voteAverage ?? 0).toFixed(1)}/10</p>
            <p className="text-sm text-zinc-700 mt-2 line-clamp-3">{movie.overview || 'No overview yet.'}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
