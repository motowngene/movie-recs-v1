export type Movie = {
  id: number;
  title: string;
  overview: string;
  posterPath?: string;
  releaseDate?: string;
  voteAverage?: number;
  genreIds?: number[];
};

export type RecommendationReason = {
  short: string;
  detail: string;
};

export type RecommendedMovie = Movie & {
  score: number;
  why: RecommendationReason;
};
