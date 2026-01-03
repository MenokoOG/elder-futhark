import React from "react";
import { Card } from "@efa/ui";

export function RuneCard(props: {
  glyph: string;
  name: string;
  phonetic: string;
  meaning: string[];
  notes: string;
  aett: number;
}) {
  return (
    <Card className="h-full">
      <div className="flex items-start justify-between gap-4">
        <div className="text-5xl rune-glow">{props.glyph}</div>
        <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-1 text-xs font-mono">
          Aett {props.aett}
        </div>
      </div>

      <div className="mt-3">
        <div className="text-lg font-bold">{props.name}</div>
        <div className="text-xs text-white/60 font-mono">phonetic: {props.phonetic}</div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {props.meaning.map((m) => (
          <span key={m} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs">
            {m}
          </span>
        ))}
      </div>

      <p className="mt-3 text-sm text-white/75">{props.notes}</p>
    </Card>
  );
}