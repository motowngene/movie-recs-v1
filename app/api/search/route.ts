import { NextRequest, NextResponse } from 'next/server';
import { searchMovies } from '@/lib/tmdb';

export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams.get('q') ?? '';
    const movies = await searchMovies(q);
    return NextResponse.json({ movies });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Search failed' }, { status: 500 });
  }
}
