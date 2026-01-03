import React from "react";
import { Card, Button } from "@efa/ui";
import { transliterate, type TransliterationMode } from "@efa/shared";
import { api } from "../../lib/api";

export function TransliteratePage() {
  const [input, setInput] = React.useState("the quick brown fox jumps over the lazy dog");
  const [mode, setMode] = React.useState<TransliterationMode>("phonetic");
  const [useApi, setUseApi] = React.useState(false);
  const [result, setResult] = React.useState(() => transliterate(input, mode));
  const [busy, setBusy] = React.useState(false);

  async function run() {
    if (!useApi) {
      setResult(transliterate(input, mode));
      return;
    }
    setBusy(true);
    try {
      const res = await api.post("/tools/transliterate", { input, mode });
      setResult(res.data);
    } finally {
      setBusy(false);
    }
  }

  React.useEffect(() => {
    void run();
  }, [mode]);

  return (
    <div className="grid gap-4">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight">Transliteration Engine</h2>
        <p className="text-sm text-white/60">
          Multiple modes: phonetic, substitution, reverse, atbash. Runs client-side or via API (for demo cred).
        </p>
      </div>

      <Card className="grid gap-3">
        <label className="text-xs text-white/60 font-mono">input</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={4}
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/40"
        />

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as TransliterationMode)}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/40"
          >
            <option value="phonetic">phonetic</option>
            <option value="simple-substitution">simple-substitution</option>
            <option value="reverse">reverse</option>
            <option value="atbash">atbash</option>
          </select>

          <label className="flex items-center gap-2 text-sm text-white/70">
            <input
              type="checkbox"
              checked={useApi}
              onChange={(e) => setUseApi(e.target.checked)}
            />
            run via API
          </label>

          <Button onClick={run} disabled={busy}>
            {busy ? "Running..." : "Transliterate"}
          </Button>
        </div>
      </Card>

      <Card>
        <div className="text-xs text-white/60 font-mono">output runes</div>
        <div className="mt-2 text-3xl rune-glow break-words">{result.outputRunes}</div>

        <div className="mt-4 text-xs text-white/60 font-mono">output keys</div>
        <div className="mt-2 text-sm text-white/80 break-words">
          {result.outputKeys.join(" ")}
        </div>
      </Card>
    </div>
  );
}