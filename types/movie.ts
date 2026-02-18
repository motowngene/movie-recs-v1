export type Movie = {
  id: number;
  title: string;
  overview: string;
  posterPath?: string;
  releaseDate?: string;
  voteAverage?: number;
  genreIds?: number[];
};

export type CastMember = {
  id: number;
  name: string;
  character?: string;
  profilePath?: string;
};

export type RecommendationReason = {
  short: string;
  detail: string;
};

export type RecommendedMovie = Movie & {
  score: number;
  why: RecommendationReason;
  cast?: CastMember[];
};

export type ActorConnection = {
  actorA: string;
  actorB: string;
  sharedMovies: string[];
};
