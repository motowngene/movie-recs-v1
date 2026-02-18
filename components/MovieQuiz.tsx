'use client';

import { useMemo, useState } from 'react';

type Question = {
  prompt: string;
  options: string[];
  answer: string;
};

const QUESTIONS: Question[] = [
  {
    prompt: 'Which film won Best Picture at the Oscars for 2020 (ceremony in 2020)?',
    options: ['1917', 'Parasite', 'Joker', 'Ford v Ferrari'],
    answer: 'Parasite'
  },
  {
    prompt: 'What does IMDb stand for?',
    options: ['Internet Movie Database', 'International Movie Data Bank', 'Independent Movie Database', 'Internet Media Data Base'],
    answer: 'Internet Movie Database'
  },
  {
    prompt: 'Which franchise features the character Ethan Hunt?',
    options: ['James Bond', 'Bourne', 'Mission: Impossible', 'John Wick'],
    answer: 'Mission: Impossible'
  }
];

export function MovieQuiz() {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const score = useMemo(
    () => QUESTIONS.reduce((acc, q, idx) => (answers[idx] === q.answer ? acc + 1 : acc), 0),
    [answers]
  );

  return (
    <section className="card-glass rounded-2xl p-5 space-y-4">
      <h2 className="text-xl font-semibold">🧠 Test Your Movie Knowledge</h2>
      <div className="space-y-4">
        {QUESTIONS.map((q, idx) => (
          <div key={q.prompt} className="rounded-xl border border-zinc-800 p-3">
            <p className="font-medium mb-2">{idx + 1}. {q.prompt}</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {q.options.map((option) => {
                const selected = answers[idx] === option;
                return (
                  <button
                    key={option}
                    onClick={() => setAnswers((curr) => ({ ...curr, [idx]: option }))}
                    className={`rounded-lg border px-3 py-2 text-sm text-left ${selected ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300' : 'border-zinc-700 bg-zinc-900 text-zinc-300'}`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <p className="text-sm text-zinc-300">Score: <span className="font-semibold text-emerald-300">{score}/{QUESTIONS.length}</span></p>
    </section>
  );
}
