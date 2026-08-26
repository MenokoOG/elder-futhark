import React from "react";
import { Card } from "../ui/components/Card.jsx";
import { Button } from "../ui/components/Button.jsx";
import { Link } from "react-router-dom";
import { useAuth } from "../state/auth.jsx";

export function Home() {
  const { user } = useAuth();

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card title="Elder Futhark Academy">
        <p className="text-zinc-300">
          Learn Elder Futhark by <span className="text-zinc-100">sound</span>, <span className="text-zinc-100">shape</span>, and <span className="text-zinc-100">meaning</span>.
          Use decks, quizzes, a daily ritual, and study reviews.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link to="/runes"><Button>Browse Runes</Button></Link>
          <Link to="/quiz"><Button>Take a Quiz</Button></Link>
          <Link to="/tools/transliterate"><Button>Transliterate</Button></Link>
        </div>

        <div className="mt-4 text-sm text-zinc-400">
          {user ? <>Signed in as <span className="text-zinc-200">{user.email}</span></> : <>Sign in to unlock Ritual, Study, Progress, and Stats.</>}
        </div>
      </Card>

      <Card title="Your path">
        <ol className="list-decimal space-y-2 pl-5 text-zinc-300">
          <li>Start with Aett 1: 8 runes.</li>
          <li>Use decks (flashcards) daily.</li>
          <li>Take quizzes until you can hit 80% consistently.</li>
          <li>Claim the daily rune (Ritual) and review it.</li>
        </ol>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link to="/flashcards"><Button>Open Decks</Button></Link>
          <Link to="/study"><Button>Study Queue</Button></Link>
          <Link to="/ritual"><Button>Daily Ritual</Button></Link>
        </div>
      </Card>
    </div>
  );
}
