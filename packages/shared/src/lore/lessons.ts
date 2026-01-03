export type LoreLesson = {
  id: string;
  aett: 1 | 2 | 3;
  title: string;
  summary: string;
  bullets: string[];
};

export const LORE_LESSONS: LoreLesson[] = [
  {
    id: "a1-signal-and-craft",
    aett: 1,
    title: "Aett 1: Signal, Motion, Craft",
    summary: "Foundation runes: resources, will, boundaries, and momentum.",
    bullets: [
      "Think of Aett 1 as the startup phase: fuel + constraints + direction.",
      "Fehu/Ansuz/Raidho form a strong triangle: resources → message → motion.",
      "Kenaz and Gebo are your 'engineering system': craft and exchange."
    ]
  },
  {
    id: "a1-boundary-and-joy",
    aett: 1,
    title: "Aett 1: Boundaries and Belonging",
    summary: "Defense, balance, and cohesion.",
    bullets: [
      "Thurisaz is a boundary test: pass only what helps the system.",
      "Wunjo is group coherence: successful teams are stable feedback loops."
    ]
  },
  {
    id: "a2-disruption-and-cycles",
    aett: 2,
    title: "Aett 2: Disruption and Cycles",
    summary: "Reset events, constraints, and outcomes earned over time.",
    bullets: [
      "Hagalaz: entropy event. Resilience is planned before the storm.",
      "Nauthiz: constraint. Constraints create architecture.",
      "Jera: harvest. Consistency pays on schedule."
    ]
  },
  {
    id: "a2-mystery-and-defense",
    aett: 2,
    title: "Aett 2: Mystery, Protection, Wholeness",
    summary: "Unknown variables, defense posture, and victory through coherence.",
    bullets: [
      "Perthro is probability: the unknown has structure—model it.",
      "Algiz is posture: protect what matters; detect what doesn’t belong.",
      "Sowilo is coherence: energy aligned becomes velocity."
    ]
  },
  {
    id: "a3-honor-and-growth",
    aett: 3,
    title: "Aett 3: Honor, Growth, Partnership",
    summary: "Responsibility, nurturing, and trustworthy motion.",
    bullets: [
      "Tiwaz: do the right thing even when it costs you.",
      "Berkano: growth requires protection and patience.",
      "Ehwaz: systems move faster when trust reduces friction."
    ]
  },
  {
    id: "a3-legacy-and-breakthrough",
    aett: 3,
    title: "Aett 3: Legacy and Breakthrough",
    summary: "The long game: identity, flow, stored potential, and a new day.",
    bullets: [
      "Mannaz: the self inside the collective.",
      "Ingwaz: stored power; ship when ready.",
      "Dagaz/Othala: transformation and heritage—what you leave behind."
    ]
  }
];