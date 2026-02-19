export function BecauseYouLiked({ reasons }: { reasons: Array<{ title: string; detail: string }> }) {
  if (reasons.length === 0) return null;

  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold">Because you liked...</h2>
      <div className="grid gap-3 md:grid-cols-3">
        {reasons.map((reason) => (
          <article key={reason.title} className="card-glass rounded-2xl p-4">
            <p className="text-sm font-semibold text-zinc-900">{reason.title}</p>
            <p className="mt-2 text-sm text-zinc-700">{reason.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
