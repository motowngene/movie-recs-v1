import { NextRequest, NextResponse } from 'next/server';
import { discoverUpcomingByGenre } from '@/lib/tmdb';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const favoriteGenres: number[] = Array.isArray(body.favoriteGenres) ? body.favoriteGenres : [];
    const upcoming = await discoverUpcomingByGenre(favoriteGenres);
    return NextResponse.json({ upcoming });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Upcoming movies failed' }, { status: 500 });
  }
}
