import { GENRES } from '@/lib/recommender';

export function GenrePicker({
  selected,
  onToggle
}: {
  selected: number[];
  onToggle: (id: number) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {GENRES.map((genre) => {
        const active = selected.includes(genre.id);
        return (
          <button
            type="button"
            key={genre.id}
            onClick={() => onToggle(genre.id)}
            className={`rounded-full border px-3 py-1 text-sm transition ${
              active
                ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                : 'border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-zinc-500'
            }`}
          >
            {genre.name}
          </button>
        );
      })}
    </div>
  );
}
