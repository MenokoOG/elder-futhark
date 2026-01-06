import React from "react";
import { Card, Button } from "@efa/ui";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export function Home() {
  return (
    <div className="grid gap-6">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="grid gap-4"
      >
        <h1 className="text-3xl font-extrabold tracking-tight">
          Learn the Elder Futhark — like a Badass !!!🧠⚡
        </h1>
        <p className="max-w-3xl text-white/70">
          This app is built to be fun *and* sharp: shared schemas, clean API boundaries, and a UI that feels like a rune console.
          Explore, drill flashcards, then prove it with quizzes.
        </p>

        <div className="flex flex-wrap gap-2">
          <Link to="/runes"><Button>Explore Runes</Button></Link>
          <Link to="/flashcards"><Button variant="ghost">Start Flashcards</Button></Link>
          <Link to="/quiz"><Button variant="ghost">Take a Quiz</Button></Link>
        </div>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <div className="text-4xl rune-glow">ᚨ</div>
          <div className="mt-2 font-bold">Explorer</div>
          <p className="mt-2 text-sm text-white/70">
            Search by name, meaning keywords, phonetics, and filter by Aett.
          </p>
        </Card>
        <Card>
          <div className="text-4xl rune-glow">ᛇ</div>
          <div className="mt-2 font-bold">Flashcards</div>
          <p className="mt-2 text-sm text-white/70">
            Fast repetition. Mark cards as “Known” or “Again” to train recall.
          </p>
        </Card>
        <Card>
          <div className="text-4xl rune-glow">ᛞ</div>
          <div className="mt-2 font-bold">Quiz Engine</div>
          <p className="mt-2 text-sm text-white/70">
            Multiple-choice meaning recognition with randomized distractors.
          </p>
        </Card>
      </div>
    </div>
  );
}