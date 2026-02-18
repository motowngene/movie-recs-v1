const FACTS = [
  'The movie with the highest number of Oscar wins is Ben-Hur, Titanic, and The Lord of the Rings: The Return of the King (11 each).',
  'The first feature-length animated movie was Snow White and the Seven Dwarfs (1937).',
  'IMDb ratings are user-generated and can shift over time as more people vote.',
  'Many trailers are cut before final VFX are complete, so scenes can differ from the final film.',
  'TMDB and IMDb scores are based on different user communities, so they often diverge.'
];

export function FunFacts() {
  return (
    <section className="card-glass rounded-2xl p-5 space-y-3">
      <h2 className="text-xl font-semibold">🎬 Fun Movie Facts</h2>
      <ul className="list-disc space-y-2 pl-6 text-sm text-zinc-300">
        {FACTS.map((fact) => (
          <li key={fact}>{fact}</li>
        ))}
      </ul>
    </section>
  );
}
