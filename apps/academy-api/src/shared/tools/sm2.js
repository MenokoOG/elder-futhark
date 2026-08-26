function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

// quality: 0..5
function sm2Update(state, quality) {
  const q = clamp(Number(quality ?? 3), 0, 5);

  let repetitions = state.repetitions ?? 0;
  let intervalDays = state.intervalDays ?? 0;
  let easeFactor = state.easeFactor ?? 2.5;
  let lapses = state.lapses ?? 0;

  if (q < 3) {
    repetitions = 0;
    intervalDays = 1;
    lapses += 1;
  } else {
    repetitions += 1;
    if (repetitions === 1) intervalDays = 1;
    else if (repetitions === 2) intervalDays = 6;
    else intervalDays = Math.round(intervalDays * easeFactor);
  }

  easeFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  easeFactor = Math.max(1.3, easeFactor);

  return { repetitions, intervalDays, easeFactor, lapses };
}

module.exports = { sm2Update };