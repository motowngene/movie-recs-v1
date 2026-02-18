import { ActorConnection } from '@/types/movie';

export function ActorNetwork({
  highlights,
  connections
}: {
  highlights: Array<{ name: string; appearances: number }>;
  connections: ActorConnection[];
}) {
  if (!highlights.length && !connections.length) return null;

  return (
    <section className="card-glass rounded-2xl p-5 space-y-4">
      <h2 className="text-xl font-semibold">🕸️ Actor Connection Graph</h2>

      {highlights.length > 0 && (
        <div>
          <p className="text-sm text-zinc-400 mb-2">Most frequent actors in your recommendations</p>
          <div className="flex flex-wrap gap-2">
            {highlights.map((actor) => (
              <span key={actor.name} className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-200">
                {actor.name} · {actor.appearances} title{actor.appearances > 1 ? 's' : ''}
              </span>
            ))}
          </div>
        </div>
      )}

      {connections.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-zinc-400">How actors are related (co-star connections)</p>
          <ul className="space-y-2 text-sm text-zinc-300">
            {connections.slice(0, 8).map((edge) => (
              <li key={`${edge.actorA}-${edge.actorB}`} className="rounded-lg border border-zinc-800 p-2">
                <span className="text-emerald-300">{edge.actorA}</span> ↔ <span className="text-emerald-300">{edge.actorB}</span>
                <div className="text-xs text-zinc-400 mt-1">Shared in: {edge.sharedMovies.join(', ')}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
