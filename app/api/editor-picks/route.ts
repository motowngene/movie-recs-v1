import { NextRequest, NextResponse } from 'next/server';
import { discoverEditorPicks } from '@/lib/tmdb';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const favoriteGenres: number[] = Array.isArray(body.favoriteGenres) ? body.favoriteGenres : [];
    const editorPicks = await discoverEditorPicks(favoriteGenres);
    return NextResponse.json({ editorPicks });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Editor picks failed' }, { status: 500 });
  }
}
