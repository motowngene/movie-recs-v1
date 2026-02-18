import { RecommendedMovie, Movie } from '@/types/movie';

const genreMap: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  27: 'Horror',
  9648: 'Mystery',
  878: 'Sci-Fi',
  53: 'Thriller'
};

export function rankMovies(input: {
  candidates: Movie[];
  favoriteGenres: number[];
  minVoteAverage?: number;
}): RecommendedMovie[] {
  const { candidates, favoriteGenres, minVoteAverage = 6.0 } = input;

  const scored = candidates
    .filter((m) => (m.voteAverage ?? 0) >= minVoteAverage)
    .map((m) => {
      const overlap = (m.genreIds ?? []).filter((g) => favoriteGenres.includes(g)).length;
      const ratingBoost = (m.voteAverage ?? 0) / 10;
      const popularityScore = overlap * 2 + ratingBoost;

      const matchedGenre = (m.genreIds ?? []).find((g) => favoriteGenres.includes(g));
      const genreName = matchedGenre ? genreMap[matchedGenre] ?? 'your taste profile' : 'strong audience ratings';

      return {
        ...m,
        score: Number(popularityScore.toFixed(2)),
        why: {
          short: overlap > 0 ? `Matches your ${genreName} interest` : 'Highly rated by audiences',
          detail:
            overlap > 0
              ? `This title overlaps with ${overlap} of your selected genre preferences and has a solid community rating.`
              : 'This title was selected for its broad audience appeal and strong average rating.'
        }
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 12);

  return scored;
}

export const GENRES = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 27, name: 'Horror' },
  { id: 9648, name: 'Mystery' },
  { id: 878, name: 'Sci-Fi' },
  { id: 53, name: 'Thriller' }
];
