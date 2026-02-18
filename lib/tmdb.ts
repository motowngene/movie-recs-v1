import { Movie } from '@/types/movie';

const TMDB_BASE = 'https://api.themoviedb.org/3';

function getTmdbAuth() {
  const readToken = process.env.TMDB_API_READ_ACCESS_TOKEN || process.env.TMDB_API_KEY;
  if (!readToken) {
    throw new Error('TMDB auth is missing. Set TMDB_API_READ_ACCESS_TOKEN (preferred) or TMDB_API_KEY');
  }

  // TMDB v4 read tokens are JWT-like and must be sent as Bearer auth.
  if (readToken.startsWith('eyJ')) {
    return { type: 'bearer' as const, value: readToken };
  }

  // Legacy TMDB v3 key support.
  return { type: 'api_key' as const, value: readToken };
}

async function tmdbFetch<T>(path: string): Promise<T> {
  const auth = getTmdbAuth();

  const url =
    auth.type === 'api_key'
      ? `${TMDB_BASE}${path}${path.includes('?') ? '&' : '?'}api_key=${auth.value}`
      : `${TMDB_BASE}${path}`;

  const res = await fetch(url, {
    headers: auth.type === 'bearer' ? { Authorization: `Bearer ${auth.value}` } : undefined,
    next: { revalidate: 1800 }
  });
  if (!res.ok) throw new Error(`TMDB error: ${res.status}`);
  return res.json();
}

export async function searchMovies(query: string): Promise<Movie[]> {
  if (!query.trim()) return [];
  const data = await tmdbFetch<{ results: any[] }>(`/search/movie?query=${encodeURIComponent(query)}`);
  return data.results.slice(0, 20).map(toMovie);
}

export async function discoverByGenre(genreIds: number[]): Promise<Movie[]> {
  const genreParam = genreIds.length ? `&with_genres=${genreIds.join(',')}` : '';
  const data = await tmdbFetch<{ results: any[] }>(`/discover/movie?sort_by=popularity.desc${genreParam}`);
  return data.results.slice(0, 30).map(toMovie);
}

function toMovie(m: any): Movie {
  return {
    id: m.id,
    title: m.title,
    overview: m.overview,
    posterPath: m.poster_path,
    releaseDate: m.release_date,
    voteAverage: m.vote_average,
    genreIds: m.genre_ids
  };
}
