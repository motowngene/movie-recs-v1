import { ActorConnection } from '@/types/movie';

function groupConnections(connections: ActorConnection[]) {
  const grouped = new Map<string, Array<{ actor: string; sharedMovies: string[] }>>();

  for (const edge of connections) {
    if (!grouped.has(edge.actorA)) grouped.set(edge.actorA, []);
    if (!grouped.has(edge.actorB)) grouped.set(edge.actorB, []);
    grouped.get(edge.actorA)?.push({ actor: edge.actorB, sharedMovies: edge.sharedMovies });
    grouped.get(edge.actorB)?.push({ actor: edge.actorA, sharedMovies: edge.sharedMovies });
  }

  return Array.from(grouped.entries())
    .map(([anchor, links]) => ({
      anchor,
      links: [...links].sort((a, b) => b.sharedMovies.length - a.sharedMovies.length).slice(0, 3),
      strength: links.reduce((sum, link) => sum + link.sharedMovies.length, 0)
    }))
    .sort((a, b) => b.strength - a.strength)
    .slice(0, 6);
}

export function ActorNetwork({
  highlights,
  connections
}: {
  highlights: Array<{ name: string; appearances: number }>;
  connections: ActorConnection[];
}) {
  if (!highlights.length && !connections.length) return null;

  const groupedLinks = groupConnections(connections);

  return (
    <section className="card-glass rounded-2xl p-5 space-y-4">
      <h2 className="text-xl font-semibold">🕸️ Actor Connection Graph</h2>

      {highlights.length > 0 && (
        <div>
          <p className="text-sm text-zinc-600 mb-2">Most frequent actors in your recommendations</p>
          <div className="flex flex-wrap gap-2">
            {highlights.map((actor) => (
              <span key={actor.name} className="rounded-full bg-amber-100 px-3 py-1 text-xs text-zinc-700">
                {actor.name} · {actor.appearances} title{actor.appearances > 1 ? 's' : ''}
              </span>
            ))}
          </div>
        </div>
      )}

      {groupedLinks.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm text-zinc-600">Strongest co-star clusters (grouped by actor)</p>
          <div className="grid gap-3 md:grid-cols-2">
            {groupedLinks.map((group) => (
              <article key={group.anchor} className="rounded-lg border border-amber-200 bg-white/70 p-3">
                <h3 className="text-sm font-semibold text-zinc-800">{group.anchor}</h3>
                <ul className="mt-2 space-y-1 text-xs text-zinc-700">
                  {group.links.map((link) => (
                    <li key={`${group.anchor}-${link.actor}`}>
                      <span className="text-orange-700">↔ {link.actor}</span> · {link.sharedMovies.length} shared
                      <span className="text-zinc-500"> ({link.sharedMovies.slice(0, 2).join(', ')})</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
