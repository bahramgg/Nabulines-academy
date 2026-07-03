"use client";

import { useState } from "react";

export type QuizQuestion = {
  q: string;
  options: string[];
  answer: number;
  points: number;
};

// Monochrome quiz: correct = filled white, wrong = outline. Icons ✓ / ✗, no
// green/red per the design rules.
export function Quiz({ questions }: { questions: QuizQuestion[] }) {
  const [picked, setPicked] = useState<Record<number, number>>({});

  if (!questions.length) return null;

  return (
    <div className="flex flex-col gap-6">
      {questions.map((question, qi) => {
        const choice = picked[qi];
        const answered = choice !== undefined;
        return (
          <div key={qi} className="card p-5">
            <p className="mb-4 font-medium">{question.q}</p>
            <div className="flex flex-col gap-2">
              {question.options.map((opt, oi) => {
                const isPicked = choice === oi;
                const isCorrect = oi === question.answer;
                let cls = "border-border text-white hover:bg-white/5";
                let icon = "";
                if (answered && isCorrect) {
                  cls = "border-white bg-white text-black";
                  icon = "✓";
                } else if (answered && isPicked && !isCorrect) {
                  cls = "border-white/40 text-text-2";
                  icon = "✗";
                }
                return (
                  <button
                    key={oi}
                    type="button"
                    disabled={answered}
                    onClick={() => setPicked((p) => ({ ...p, [qi]: oi }))}
                    className={`flex items-center justify-between rounded-btn border px-4 py-3 text-left text-sm transition-colors disabled:cursor-default ${cls}`}
                  >
                    <span>{opt}</span>
                    {icon && <span aria-hidden>{icon}</span>}
                  </button>
                );
              })}
            </div>
            {answered && (
              <p className="mt-3 text-xs text-text-3">
                {choice === question.answer
                  ? `Correct · +${question.points} pts`
                  : "Not quite — review the lesson and try the exercise."}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
