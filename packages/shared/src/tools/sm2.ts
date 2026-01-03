export type Sm2State = {
  repetitions: number;
  intervalDays: number;
  easeFactor: number; // EF
  dueAt: string;      // ISO timestamp
  lapses: number;
};

export type Sm2Grade = 0 | 1 | 2 | 3 | 4 | 5;

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function sm2Init(now = new Date()): Sm2State {
  const due = new Date(now);
  return {
    repetitions: 0,
    intervalDays: 0,
    easeFactor: 2.5,
    dueAt: due.toISOString(),
    lapses: 0
  };
}

/**
 * SM-2 update.
 * grade: 0..5 (0=complete blackout, 5=perfect)
 */
export function sm2Review(prev: Sm2State, grade: Sm2Grade, now = new Date()): Sm2State {
  let { repetitions, intervalDays, easeFactor, lapses } = prev;

  // EF update (classic SM-2)
  easeFactor = easeFactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
  easeFactor = clamp(easeFactor, 1.3, 2.7);

  if (grade < 3) {
    repetitions = 0;
    intervalDays = 1;
    lapses += 1;
  } else {
    repetitions += 1;
    if (repetitions === 1) intervalDays = 1;
    else if (repetitions === 2) intervalDays = 6;
    else intervalDays = Math.round(intervalDays * easeFactor);
  }

  const due = new Date(now);
  due.setDate(due.getDate() + intervalDays);

  return {
    repetitions,
    intervalDays,
    easeFactor,
    dueAt: due.toISOString(),
    lapses
  };
}