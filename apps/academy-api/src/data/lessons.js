// server/data/lessons.js

export const LESSONS = [
  {
    key: "intro",
    title: "Welcome to Elder Futhark Academy",
    summary: "How to use this app, how to learn runes, and what “phonetic” means.",
    sections: [
      {
        heading: "How to learn runes",
        body:
          "Go slow. Learn sound first (phonetic), then name, then meaning. Use Draw to build muscle memory. Use Study for spaced repetition."
      },
      {
        heading: "What “phonetic” means",
        body:
          "Phonetic is the sound the rune represents (like f, u, th). It is not always 1:1 with modern English spelling."
      }
    ]
  },
  {
    key: "aetts",
    title: "The Three Ættir",
    summary: "Elder Futhark is commonly grouped into three sets of eight runes.",
    sections: [
      {
        heading: "Why the grouping matters",
        body:
          "Grouping helps memory. You’ll often see runes taught as Ætt 1, Ætt 2, and Ætt 3. We use that structure in Study and Quiz."
      }
    ]
  },
  {
    key: "practice",
    title: "Practice Method",
    summary: "A simple loop: look → say → draw → recall → review.",
    sections: [
      {
        heading: "The loop",
        body:
          "1) Look at rune. 2) Say phonetic sound. 3) Draw it. 4) Recall meaning. 5) Review tomorrow (Study handles the schedule)."
      }
    ]
  }
];