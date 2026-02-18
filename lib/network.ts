import { ActorConnection, CastMember, RecommendedMovie } from '@/types/movie';

export function buildActorConnections(recommendations: RecommendedMovie[]): ActorConnection[] {
  const edgeMap = new Map<string, { actorA: string; actorB: string; sharedMovies: Set<string> }>();

  for (const movie of recommendations) {
    const cast = (movie.cast ?? []).slice(0, 5);
    for (let i = 0; i < cast.length; i++) {
      for (let j = i + 1; j < cast.length; j++) {
        const a = cast[i].name;
        const b = cast[j].name;
        const [actorA, actorB] = [a, b].sort((x, y) => x.localeCompare(y));
        const key = `${actorA}::${actorB}`;
        if (!edgeMap.has(key)) {
          edgeMap.set(key, { actorA, actorB, sharedMovies: new Set() });
        }
        edgeMap.get(key)?.sharedMovies.add(movie.title);
      }
    }
  }

  return Array.from(edgeMap.values())
    .map((edge) => ({
      actorA: edge.actorA,
      actorB: edge.actorB,
      sharedMovies: Array.from(edge.sharedMovies)
    }))
    .sort((a, b) => b.sharedMovies.length - a.sharedMovies.length)
    .slice(0, 12);
}

export function topActors(recommendations: RecommendedMovie[]): Array<{ name: string; appearances: number }> {
  const counts = new Map<string, number>();
  for (const movie of recommendations) {
    for (const actor of movie.cast ?? []) {
      counts.set(actor.name, (counts.get(actor.name) ?? 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .map(([name, appearances]) => ({ name, appearances }))
    .sort((a, b) => b.appearances - a.appearances)
    .slice(0, 12);
}
