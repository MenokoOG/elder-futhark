import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { readdir, readFile } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';

export interface PreviewSummary {
    generatedAt: string;
    rawCount: number;
    extractedCount: number;
    normalizedCounts: {
        runes: number;
        deities: number;
        worlds: number;
        practices: number;
        adjacentSystems: number;
    };
    files: {
        raw: string[];
        extracted: string[];
        normalized: string[];
    };
}

async function listJsonLikeFiles(dir: string): Promise<string[]> {
    const names = await readdir(dir, { withFileTypes: true });
    return names
        .filter((entry) => entry.isFile())
        .map((entry) => entry.name)
        .filter((name) => {
            const ext = extname(name);
            return ext === '.json' || ext === '.html';
        })
        .sort();
}

async function readArrayLength(path: string): Promise<number> {
    const raw = await readFile(path, 'utf8');
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
        throw new Error(`Expected JSON array at ${path}`);
    }
    return parsed.length;
}

export async function collectPreviewSummary(dataDir: string): Promise<PreviewSummary> {
    const rawDir = resolve(dataDir, 'raw');
    const extractedDir = resolve(dataDir, 'extracted');
    const normalizedDir = resolve(dataDir, 'normalized');

    const rawFiles = await listJsonLikeFiles(rawDir);
    const extractedFiles = await listJsonLikeFiles(extractedDir);
    const normalizedFiles = await listJsonLikeFiles(normalizedDir);

    const runes = await readArrayLength(resolve(normalizedDir, 'runes.json'));
    const deities = await readArrayLength(resolve(normalizedDir, 'deities.json'));
    const worlds = await readArrayLength(resolve(normalizedDir, 'worlds.json'));
    const practices = await readArrayLength(resolve(normalizedDir, 'practices.records.json'));
    const adjacentSystems = await readArrayLength(resolve(normalizedDir, 'adjacent-systems.records.json'));

    return {
        generatedAt: new Date().toISOString(),
        rawCount: rawFiles.filter((name) => name.endsWith('.metadata.json')).length,
        extractedCount: extractedFiles.filter((name) => name.endsWith('.records.json')).length,
        normalizedCounts: {
            runes,
            deities,
            worlds,
            practices,
            adjacentSystems
        },
        files: {
            raw: rawFiles,
            extracted: extractedFiles,
            normalized: normalizedFiles
        }
    };
}

export function buildPreviewHtml(summary: PreviewSummary): string {
    const summaryJson = JSON.stringify(summary).replace(/</g, '\\u003c');

    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Elder Futhark ETL Preview</title>
  <style>
    :root {
      --bg: #f5f1e8;
      --bg-alt: #efe7d7;
      --ink: #1f2a2a;
      --muted: #4b5b56;
      --accent: #c74f2d;
      --accent-2: #1f7a8c;
      --panel: #fffdf8;
      --line: #d9cdb7;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: "Space Grotesk", "Avenir Next", "Segoe UI", sans-serif;
      color: var(--ink);
      background:
        radial-gradient(circle at 10% 10%, rgba(199,79,45,0.16), transparent 40%),
        radial-gradient(circle at 90% 15%, rgba(31,122,140,0.2), transparent 45%),
        linear-gradient(170deg, var(--bg), var(--bg-alt));
      min-height: 100vh;
    }
    .wrap {
      max-width: 1100px;
      margin: 0 auto;
      padding: 28px 18px 56px;
      animation: fade-in 500ms ease-out;
    }
    h1 {
      margin: 0 0 6px;
      font-size: clamp(1.6rem, 4vw, 2.4rem);
      letter-spacing: 0.01em;
    }
    .sub {
      margin: 0 0 22px;
      color: var(--muted);
      font-size: 0.95rem;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(5, minmax(0, 1fr));
      gap: 12px;
      margin-bottom: 22px;
    }
    .card {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 14px;
      padding: 14px;
      box-shadow: 0 10px 24px rgba(31,42,42,0.07);
      transform: translateY(8px);
      opacity: 0;
      animation: slide-up 360ms ease-out forwards;
    }
    .card:nth-child(2) { animation-delay: 50ms; }
    .card:nth-child(3) { animation-delay: 100ms; }
    .card:nth-child(4) { animation-delay: 150ms; }
    .card:nth-child(5) { animation-delay: 200ms; }
    .label { font-size: 0.74rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em; }
    .value { margin-top: 6px; font-size: 1.5rem; font-weight: 700; color: var(--accent-2); }
    .panel {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 16px;
      padding: 16px;
      margin-bottom: 14px;
    }
    h2 { margin: 0 0 10px; font-size: 1.05rem; }
    ul { margin: 0; padding-left: 16px; }
    li { margin: 3px 0; font-size: 0.92rem; color: var(--ink); }
    code {
      background: #f2ecdf;
      padding: 1px 6px;
      border-radius: 6px;
      border: 1px solid #e3d7c2;
      font-size: 0.82rem;
    }
    .footer {
      margin-top: 16px;
      color: var(--muted);
      font-size: 0.82rem;
    }
    @media (max-width: 900px) {
      .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
    @media (max-width: 540px) {
      .grid { grid-template-columns: 1fr; }
      .wrap { padding: 18px 12px 34px; }
    }
    @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slide-up { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  </style>
</head>
<body>
  <main class="wrap">
    <h1>Elder Futhark ETL Preview</h1>
    <p class="sub">Local read-only dashboard over generated ETL artifacts.</p>

    <section class="grid" id="cards"></section>

    <section class="panel">
      <h2>Raw Artifacts</h2>
      <ul id="raw-list"></ul>
    </section>

    <section class="panel">
      <h2>Extracted Artifacts</h2>
      <ul id="extracted-list"></ul>
    </section>

    <section class="panel">
      <h2>Normalized Artifacts</h2>
      <ul id="normalized-list"></ul>
    </section>

    <p class="footer" id="generated"></p>
  </main>

  <script>
    const summary = ${summaryJson};

    const cards = [
      ['Raw Sources', summary.rawCount],
      ['Extracted Sources', summary.extractedCount],
      ['Runes', summary.normalizedCounts.runes],
      ['Deities', summary.normalizedCounts.deities],
      ['Worlds', summary.normalizedCounts.worlds]
    ];

    const cardsHost = document.getElementById('cards');
    cards.forEach(([label, value]) => {
      const node = document.createElement('article');
      node.className = 'card';
      node.innerHTML = '<div class="label">' + label + '</div><div class="value">' + value + '</div>';
      cardsHost.appendChild(node);
    });

    const fillList = (id, names) => {
      const host = document.getElementById(id);
      names.forEach((name) => {
        const li = document.createElement('li');
        li.innerHTML = '<code>' + name + '</code>';
        host.appendChild(li);
      });
    };

    fillList('raw-list', summary.files.raw);
    fillList('extracted-list', summary.files.extracted);
    fillList('normalized-list', summary.files.normalized);

    document.getElementById('generated').textContent = 'Generated at ' + summary.generatedAt;
  </script>
    </body>
    </html>`;
}

function sendJson(res: ServerResponse, status: number, body: unknown): void {
    res.statusCode = status;
    res.setHeader('content-type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(body, null, 2));
}

async function route(req: IncomingMessage, res: ServerResponse, dataDir: string): Promise<void> {
    const url = req.url ?? '/';

    if (url === '/healthz') {
        sendJson(res, 200, { ok: true });
        return;
    }

    if (url === '/api/summary') {
        try {
            const summary = await collectPreviewSummary(dataDir);
            sendJson(res, 200, summary);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            sendJson(res, 500, { error: message });
        }
        return;
    }

    if (url === '/' || url === '/index.html') {
        const summary = await collectPreviewSummary(dataDir);
        res.statusCode = 200;
        res.setHeader('content-type', 'text/html; charset=utf-8');
        res.end(buildPreviewHtml(summary));
        return;
    }

    if (url.startsWith('/data/')) {
        const relative = url.replace('/data/', '');
        if (relative.includes('..')) {
            sendJson(res, 400, { error: 'invalid path' });
            return;
        }
        const absolute = join(dataDir, relative);
        try {
            const text = await readFile(absolute, 'utf8');
            res.statusCode = 200;
            res.setHeader('content-type', 'application/json; charset=utf-8');
            res.end(text);
        } catch {
            sendJson(res, 404, { error: 'not found' });
        }
        return;
    }

    sendJson(res, 404, { error: 'not found' });
}

export async function startPreviewServer(dataDir: string, port: number): Promise<void> {
    const server = createServer((req, res) => {
        route(req, res, dataDir).catch((error) => {
            const message = error instanceof Error ? error.message : String(error);
            sendJson(res, 500, { error: message });
        });
    });

    await new Promise<void>((resolvePromise, reject) => {
        server.once('error', reject);
        server.listen(port, '127.0.0.1', () => resolvePromise());
    });

    process.on('SIGINT', () => {
        server.close(() => process.exit(0));
    });
}
