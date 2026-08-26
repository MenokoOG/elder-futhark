export function gradeSM2({ quality, repetitions, intervalDays, easeFactor, lapses }) {
  let ef = easeFactor;
  ef = ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (ef < 1.3) ef = 1.3;

  let reps = repetitions;
  let interval = intervalDays;
  let nextLapses = lapses;

  if (quality < 3) {
    reps = 0;
    interval = 1;
    nextLapses += 1;
  } else {
    reps += 1;
    if (reps === 1) interval = 1;
    else if (reps === 2) interval = 6;
    else interval = Math.round(interval * ef);
  }

  return { repetitions: reps, intervalDays: interval, easeFactor: ef, lapses: nextLapses };
}
