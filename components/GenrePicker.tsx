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
                ? 'border-orange-400 bg-orange-100 text-orange-800'
                : 'border-amber-300 bg-white text-zinc-700 hover:border-orange-300'
            }`}
          >
            {genre.name}
          </button>
        );
      })}
    </div>
  );
}
