import { NextRequest, NextResponse } from 'next/server';
import { discoverByGenre } from '@/lib/tmdb';
import { rankMovies } from '@/lib/recommender';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const favoriteGenres: number[] = Array.isArray(body.favoriteGenres) ? body.favoriteGenres : [];
    const minVoteAverage = Number(body.minVoteAverage ?? 6.0);

    const candidates = await discoverByGenre(favoriteGenres);
    const recommendations = rankMovies({ candidates, favoriteGenres, minVoteAverage });

    return NextResponse.json({ recommendations });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Recommendation failed' }, { status: 500 });
  }
}
