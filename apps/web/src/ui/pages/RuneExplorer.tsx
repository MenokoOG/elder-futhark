import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { RuneCard } from "../components/RuneCard";
import { RuneSchema } from "@efa/shared";
import { z } from "zod";

const RuneArraySchema = z.array(RuneSchema);

export function RuneExplorer() {
  const [q, setQ] = React.useState("");
  const [aett, setAett] = React.useState<number | "">("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["runes", q, aett],
    queryFn: async () => {
      const res = await api.get("/runes", { params: { q: q || undefined, aett: aett || undefined } });
      return RuneArraySchema.parse(res.data);
    }
  });

  return (
    <div className="grid gap-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">Rune Explorer</h2>
          <p className="text-sm text-white/60">Search meanings like “strength” or “journey”, or filter by Aett.</p>
        </div>

        <div className="flex flex-col gap-2 md:flex-row">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search (name, meaning, phonetic...)"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/40 md:w-72"
          />
          <select
            value={aett}
            onChange={(e) => setAett(e.target.value ? Number(e.target.value) : "")}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/40"
          >
            <option value="">All Aetts</option>
            <option value="1">Aett 1</option>
            <option value="2">Aett 2</option>
            <option value="3">Aett 3</option>
          </select>
        </div>
      </div>

      {isLoading && <div className="text-white/60">Loading runes…</div>}
      {error && <div className="text-red-300">Error loading runes.</div>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data?.map((r) => (
          <RuneCard
            key={r.key}
            glyph={r.glyph}
            name={r.name}
            phonetic={r.phonetic}
            meaning={r.meaning}
            notes={r.notes}
            aett={r.aett}
          />
        ))}
      </div>
    </div>
  );
}