import { NextRequest, NextResponse } from 'next/server';
import { discoverByGenre, getMovieCast } from '@/lib/tmdb';
import { rankMovies } from '@/lib/recommender';
import { buildActorConnections, topActors } from '@/lib/network';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const favoriteGenres: number[] = Array.isArray(body.favoriteGenres) ? body.favoriteGenres : [];
    const minVoteAverage = Number(body.minVoteAverage ?? 6.0);

    const candidates = await discoverByGenre(favoriteGenres);
    const ranked = rankMovies({ candidates, favoriteGenres, minVoteAverage });

    const recommendations = await Promise.all(
      ranked.map(async (movie) => {
        try {
          const cast = await getMovieCast(movie.id);
          return { ...movie, cast };
        } catch {
          return movie;
        }
      })
    );

    const actorConnections = buildActorConnections(recommendations);
    const actorHighlights = topActors(recommendations);

    return NextResponse.json({ recommendations, actorConnections, actorHighlights });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Recommendation failed' }, { status: 500 });
  }
}
