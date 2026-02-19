import { NextRequest, NextResponse } from 'next/server';
import { discoverUpcomingByGenre } from '@/lib/tmdb';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const favoriteGenres: number[] = Array.isArray(body.favoriteGenres) ? body.favoriteGenres : [];
    const timeframeDays = [30, 90, 180].includes(Number(body.timeframeDays)) ? Number(body.timeframeDays) : 90;
    const upcoming = await discoverUpcomingByGenre(favoriteGenres, timeframeDays);
    return NextResponse.json({ upcoming, timeframeDays });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Upcoming movies failed' }, { status: 500 });
  }
}
