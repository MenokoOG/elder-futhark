import { createServer, type IncomingMessage, type Server, type ServerResponse } from 'node:http';
import { readdir, readFile } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';
import { runCommand, type PipelineStageResult } from '../commands/run.js';

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

type CategoryId = 'runes' | 'deities' | 'worlds' | 'practices' | 'adjacentSystems';

interface DashboardCategory {
  id: CategoryId;
  label: string;
  count: number;
}

interface DashboardItemSummary {
  id: string;
  label: string;
}

interface DashboardCatalog {
  categories: DashboardCategory[];
}

export interface PipelineStatus {
  status: 'idle' | 'running' | 'succeeded' | 'failed';
  source: string;
  startedAt?: string;
  finishedAt?: string;
  results: PipelineStageResult[];
  error?: string;
}

interface PreviewServerOptions {
  runPipeline?: (source: string) => Promise<PipelineStageResult[]>;
}

interface PipelineController {
  status: PipelineStatus;
  startRun: (source: string) => Promise<boolean>;
}

const CATEGORY_CONFIG: Record<CategoryId, { label: string; file: string }> = {
  runes: { label: 'Runes', file: 'runes.json' },
  deities: { label: 'Deities', file: 'deities.json' },
  worlds: { label: 'Worlds', file: 'worlds.json' },
  practices: { label: 'Practices', file: 'practices.records.json' },
  adjacentSystems: { label: 'Adjacent Systems', file: 'adjacent-systems.records.json' }
};

function createPipelineController(
  runPipeline: (source: string) => Promise<PipelineStageResult[]>
): PipelineController {
  let activeRun: Promise<void> | null = null;
  let status: PipelineStatus = {
    status: 'idle',
    source: 'all',
    results: []
  };

  async function startRun(source: string): Promise<boolean> {
    if (activeRun) {
      return false;
    }

    const startedAt = new Date().toISOString();
    status = {
      status: 'running',
      source,
      startedAt,
      results: []
    };

    activeRun = (async () => {
      try {
        const results = await runPipeline(source);
        status = {
          status: 'succeeded',
          source,
          startedAt,
          finishedAt: new Date().toISOString(),
          results
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        status = {
          status: 'failed',
          source,
          startedAt,
          finishedAt: new Date().toISOString(),
          results: [],
          error: message
        };
      } finally {
        activeRun = null;
      }
    })();

    return true;
  }

  return {
    get status() {
      return status;
    },
    startRun
  };
}

async function listJsonLikeFiles(dir: string): Promise<string[]> {
  const names = await readdir(dir, { withFileTypes: true });
  return names
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => {
      const ext = extname(name);
      return ext === '.json' || ext === '.html' || ext === '.txt';
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

async function readArrayJson(path: string): Promise<unknown[]> {
  const raw = await readFile(path, 'utf8');
  const parsed = JSON.parse(raw) as unknown;
  if (!Array.isArray(parsed)) {
    throw new Error(`Expected JSON array at ${path}`);
  }
  return parsed;
}

function isCategoryId(value: string): value is CategoryId {
  return Object.prototype.hasOwnProperty.call(CATEGORY_CONFIG, value);
}

function itemLabel(item: Record<string, unknown>): string {
  const fromName = item.name;
  if (typeof fromName === 'string' && fromName.trim().length > 0) {
    return fromName;
  }

  const fromTitle = item.title;
  if (typeof fromTitle === 'string' && fromTitle.trim().length > 0) {
    return fromTitle;
  }

  const fromId = item.id;
  if (typeof fromId === 'string' && fromId.trim().length > 0) {
    return fromId;
  }

  return 'Unnamed record';
}

function itemId(item: Record<string, unknown>, index: number): string {
  const id = item.id;
  if (typeof id === 'string' && id.trim().length > 0) {
    return id;
  }
  return `item-${index + 1}`;
}

async function loadCategoryItems(dataDir: string, category: CategoryId): Promise<Record<string, unknown>[]> {
  const filePath = resolve(dataDir, 'normalized', CATEGORY_CONFIG[category].file);
  const items = await readArrayJson(filePath);
  return items.map((item) => {
    if (!item || typeof item !== 'object') {
      return { value: item };
    }
    return item as Record<string, unknown>;
  });
}

async function buildDashboardCatalog(dataDir: string): Promise<DashboardCatalog> {
  const categories: DashboardCategory[] = [];

  for (const id of Object.keys(CATEGORY_CONFIG) as CategoryId[]) {
    const items = await loadCategoryItems(dataDir, id);
    categories.push({
      id,
      label: CATEGORY_CONFIG[id].label,
      count: items.length
    });
  }

  return { categories };
}

async function buildCategoryList(dataDir: string, category: CategoryId): Promise<DashboardItemSummary[]> {
  const items = await loadCategoryItems(dataDir, category);
  return items.map((item, index) => ({
    id: itemId(item, index),
    label: itemLabel(item)
  }));
}

async function loadCategoryItemById(
  dataDir: string,
  category: CategoryId,
  requestedItemId: string
): Promise<Record<string, unknown> | undefined> {
  const items = await loadCategoryItems(dataDir, category);
  const index = items.findIndex((item, itemIndex) => itemId(item, itemIndex) === requestedItemId);
  if (index === -1) {
    return undefined;
  }
  return items[index];
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
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&family=Source+Sans+3:wght@400;600;700&display=swap');
    :root {
      --bg: #0f1319;
      --bg-alt: #16202b;
      --ink: #ece5d8;
      --muted: #b8b0a4;
      --accent: #cf8a3b;
      --accent-2: #62b3a8;
      --panel: rgba(15, 19, 25, 0.78);
      --line: rgba(236, 229, 216, 0.2);
      --button: #1f2b37;
      --button-active: #2a3d4f;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: "Source Sans 3", "Avenir Next", "Segoe UI", sans-serif;
      color: var(--ink);
      background:
        radial-gradient(circle at 8% 12%, rgba(207,138,59,0.25), transparent 34%),
        radial-gradient(circle at 91% 14%, rgba(98,179,168,0.22), transparent 38%),
        linear-gradient(170deg, var(--bg), var(--bg-alt));
      min-height: 100vh;
    }
    .wrap {
      max-width: 1200px;
      margin: 0 auto;
      padding: 28px 18px 56px;
      animation: fade-in 500ms ease-out;
    }
    h1 {
      margin: 0 0 6px;
      font-size: clamp(1.6rem, 4vw, 2.4rem);
      letter-spacing: 0.06em;
      font-family: "Cinzel", Georgia, serif;
      text-transform: uppercase;
    }
    .sub {
      margin: 0 0 22px;
      color: var(--muted);
      font-size: 0.95rem;
    }
    .stat-grid {
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
      backdrop-filter: blur(3px);
      box-shadow: 0 14px 34px rgba(0,0,0,0.25);
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

    .dashboard {
      display: grid;
      grid-template-columns: 260px 1fr 1.1fr;
      gap: 14px;
      margin-bottom: 16px;
    }

    .panel {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 16px;
      padding: 16px;
      min-height: 350px;
      backdrop-filter: blur(3px);
    }
    h2 { margin: 0 0 10px; font-size: 1.05rem; }

    .category-buttons {
      display: grid;
      grid-template-columns: 1fr;
      gap: 8px;
    }

    .category-btn {
      border: 1px solid var(--line);
      background: var(--button);
      color: var(--ink);
      border-radius: 10px;
      text-align: left;
      padding: 10px 12px;
      cursor: pointer;
      transition: transform 180ms ease, background 180ms ease;
      font-size: 0.95rem;
    }

    .category-btn:hover {
      transform: translateY(-1px);
      background: #24384a;
    }

    .category-btn.active {
      background: var(--button-active);
      border-color: rgba(98,179,168,0.55);
    }

    .item-list {
      list-style: none;
      margin: 0;
      padding: 0;
      max-height: 560px;
      overflow: auto;
    }

    .item-search {
      width: 100%;
      margin: 0 0 10px;
      border: 1px solid var(--line);
      border-radius: 10px;
      background: rgba(255,255,255,0.04);
      color: var(--ink);
      padding: 10px 12px;
      font-size: 0.92rem;
      outline: none;
    }

    .item-search:focus {
      border-color: rgba(98,179,168,0.8);
      box-shadow: 0 0 0 2px rgba(98,179,168,0.18);
    }

    .item-btn {
      width: 100%;
      text-align: left;
      margin: 0 0 8px;
      border: 1px solid var(--line);
      border-radius: 10px;
      background: transparent;
      color: var(--ink);
      padding: 10px;
      cursor: pointer;
      transition: border-color 180ms ease, background 180ms ease;
      font-size: 0.92rem;
    }

    .item-btn:hover { border-color: rgba(207,138,59,0.8); background: rgba(207,138,59,0.08); }
    .item-btn.active { border-color: rgba(98,179,168,0.85); background: rgba(98,179,168,0.12); }

    .item-view {
      max-height: 560px;
      overflow: auto;
      font-size: 0.9rem;
      line-height: 1.45;
      color: #e7e0d2;
      background: rgba(0,0,0,0.22);
      border: 1px solid var(--line);
      border-radius: 10px;
      padding: 12px;
    }

    .detail-title {
      margin: 0 0 8px;
      font-size: 1.05rem;
      font-family: "Cinzel", Georgia, serif;
      letter-spacing: 0.04em;
    }

    .detail-id {
      display: inline-block;
      margin: 0 0 10px;
      font-size: 0.8rem;
      color: var(--muted);
      border: 1px solid var(--line);
      border-radius: 999px;
      padding: 2px 8px;
    }

    .detail-copy {
      margin: 0 0 12px;
      color: #d8cfbf;
      font-size: 0.9rem;
    }

    .provenance {
      margin-top: 10px;
    }

    .provenance-title {
      margin: 0 0 6px;
      font-size: 0.8rem;
      color: var(--muted);
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .chip-row {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 8px;
    }

    .chip {
      font-size: 0.74rem;
      border: 1px solid rgba(98,179,168,0.55);
      color: #d9efe8;
      background: rgba(98,179,168,0.13);
      border-radius: 999px;
      padding: 2px 8px;
    }

    .detail-json {
      margin-top: 10px;
      border: 1px solid rgba(255,255,255,0.14);
      border-radius: 8px;
      padding: 8px;
      background: rgba(0,0,0,0.18);
      max-height: 260px;
      overflow: auto;
      font-family: "Fira Code", "SFMono-Regular", Consolas, monospace;
      font-size: 0.78rem;
      white-space: pre-wrap;
    }

    .artifact-panels {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 14px;
      margin-top: 14px;
    }

    ul { margin: 0; padding-left: 16px; }
    li { margin: 3px 0; font-size: 0.88rem; color: var(--ink); }
    code {
      background: rgba(255,255,255,0.07);
      padding: 1px 6px;
      border-radius: 6px;
      border: 1px solid rgba(255,255,255,0.14);
      font-size: 0.82rem;
    }
    .footer {
      margin-top: 16px;
      color: var(--muted);
      font-size: 0.82rem;
    }
    .run-controls {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin: 0 0 14px;
      align-items: center;
    }
    .run-btn {
      border: 1px solid rgba(98,179,168,0.7);
      background: rgba(98,179,168,0.2);
      color: var(--ink);
      border-radius: 10px;
      padding: 9px 12px;
      cursor: pointer;
      font-weight: 600;
    }
    .run-btn:disabled {
      opacity: 0.6;
      cursor: wait;
    }
    .run-status {
      font-size: 0.86rem;
      color: var(--muted);
    }
    @media (max-width: 1100px) {
      .dashboard {
        grid-template-columns: 1fr;
      }
      .artifact-panels {
        grid-template-columns: 1fr;
      }
      .panel {
        min-height: 260px;
      }
      .item-list, .item-view {
        max-height: 360px;
      }
      .stat-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }
    @media (max-width: 540px) {
      .stat-grid { grid-template-columns: 1fr; }
      .wrap { padding: 18px 12px 34px; }
    }
    @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slide-up { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  </style>
</head>
<body>
  <main class="wrap">
    <h1>Elder Futhark ETL Preview</h1>
    <p class="sub">Category-first explorer for normalized records with item drilldown details.</p>

    <section class="run-controls">
      <button id="run-pipeline" class="run-btn" type="button">Run Full Pipeline</button>
      <span id="run-status" class="run-status">Pipeline status: idle</span>
    </section>

    <section class="stat-grid" id="cards"></section>

    <section class="dashboard">
      <section class="panel">
        <h2>Categories</h2>
        <div id="category-buttons" class="category-buttons"></div>
      </section>

      <section class="panel">
        <h2 id="items-title">Items</h2>
        <input id="item-search" class="item-search" type="text" placeholder="Search this category..." />
        <ul id="items-list" class="item-list"></ul>
      </section>

      <section class="panel">
        <h2 id="detail-title">Item Detail</h2>
        <div id="item-view" class="item-view">Select a category, then choose an item to inspect.</div>
      </section>
    </section>

    <section class="artifact-panels">
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
    </section>

    <p class="footer" id="generated"></p>
  </main>

  <script>
    const summary = ${summaryJson};
    let activeCategory = null;
    let activeItemId = null;
    let currentCategoryLabel = '';
    let currentItems = [];

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

    const categoryButtonsHost = document.getElementById('category-buttons');
    const itemsListHost = document.getElementById('items-list');
    const itemsTitle = document.getElementById('items-title');
    const detailTitle = document.getElementById('detail-title');
    const itemView = document.getElementById('item-view');
    const itemSearchInput = document.getElementById('item-search');
    const runPipelineButton = document.getElementById('run-pipeline');
    const runStatusNode = document.getElementById('run-status');

    const escapeHtml = (value) =>
      String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\"/g, '&quot;')
        .replace(/'/g, '&#39;');

    const setDetail = (title, data) => {
      detailTitle.textContent = title;
      itemView.innerHTML = '<div class="detail-copy">' + escapeHtml(JSON.stringify(data, null, 2)) + '</div>';
    };

    const summaryText = (item) => {
      if (typeof item.summary === 'string' && item.summary.trim().length > 0) {
        return item.summary.trim();
      }
      if (typeof item.description === 'string' && item.description.trim().length > 0) {
        return item.description.trim();
      }
      if (Array.isArray(item.coreMeanings) && item.coreMeanings.length > 0) {
        const first = item.coreMeanings.find((entry) => typeof entry === 'string' && entry.trim().length > 0);
        if (first) {
          return first;
        }
      }
      if (Array.isArray(item.sections) && item.sections.length > 0) {
        const firstSection = item.sections.find((entry) => entry && typeof entry.text === 'string' && entry.text.trim().length > 0);
        if (firstSection) {
          return firstSection.text;
        }
      }
      return 'No summary text available.';
    };

    const truncate = (value, size) => {
      if (value.length <= size) {
        return value;
      }
      return value.slice(0, size - 1) + '...';
    };

    const renderDetailCard = (title, item) => {
      const text = truncate(summaryText(item), 420);
      const idValue = typeof item.id === 'string' && item.id.length > 0 ? item.id : 'unknown';
      const sources = Array.isArray(item.sources)
        ? item.sources
        : Array.isArray(item.references)
          ? item.references
          : [];

      const chips = [];
      sources.forEach((source) => {
        if (source && typeof source.classification === 'string') {
          chips.push(source.classification);
        }
      });

      const uniqueChips = [...new Set(chips)];
      const chipHtml = uniqueChips.length > 0
        ? uniqueChips.map((chip) => '<span class="chip">' + escapeHtml(chip) + '</span>').join('')
        : '<span class="chip">unclassified</span>';

      const sourceList = sources
        .map((source) => {
          const url = source && typeof source.sourceUrl === 'string' ? source.sourceUrl : '';
          if (!url) {
            return '';
          }
          return '<li><a href="' + escapeHtml(url) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(url) + '</a></li>';
        })
        .filter((entry) => entry.length > 0)
        .join('');

      itemView.innerHTML =
        '<h3 class="detail-title">' + escapeHtml(title) + '</h3>' +
        '<div class="detail-id">' + escapeHtml(idValue) + '</div>' +
        '<p class="detail-copy">' + escapeHtml(text) + '</p>' +
        '<div class="provenance">' +
        '<p class="provenance-title">Classifications</p>' +
        '<div class="chip-row">' + chipHtml + '</div>' +
        '<p class="provenance-title">Sources</p>' +
        '<ul>' + (sourceList || '<li>No source URLs available.</li>') + '</ul>' +
        '</div>' +
        '<details class="detail-json"><summary>Raw JSON</summary><pre>' +
        escapeHtml(JSON.stringify(item, null, 2)) +
        '</pre></details>';
    };

    const fetchJson = async (url) => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Request failed: ' + response.status + ' ' + response.statusText);
      }
      return response.json();
    };

    const postJson = async (url) => {
      const response = await fetch(url, { method: 'POST' });
      let payload = {};
      try {
        payload = await response.json();
      } catch {
        payload = {};
      }
      if (!response.ok) {
        const error = payload && typeof payload.error === 'string' ? payload.error : response.statusText;
        throw new Error('Request failed: ' + error);
      }
      return payload;
    };

    const formatRunSummary = (state) => {
      if (!state || !state.status) {
        return 'Pipeline status: unknown';
      }
      if (state.status === 'idle') {
        return 'Pipeline status: idle';
      }
      if (state.status === 'running') {
        return 'Pipeline status: running (' + state.source + ')';
      }
      if (state.status === 'failed') {
        return 'Pipeline status: failed (' + (state.error || 'unknown error') + ')';
      }
      const summaries = Array.isArray(state.results)
        ? state.results.map((entry) => entry.stage + '=' + entry.summary).join(' | ')
        : '';
      return 'Pipeline status: succeeded (' + (summaries || 'completed') + ')';
    };

    const refreshPipelineStatus = async () => {
      const state = await fetchJson('/api/pipeline/status');
      runStatusNode.textContent = formatRunSummary(state);
      runPipelineButton.disabled = state.status === 'running';
    };

    const renderItemsFromCurrent = () => {
      itemsListHost.innerHTML = '';

      const filter = itemSearchInput.value.trim().toLowerCase();
      const shown = currentItems.filter((item) => {
        if (!filter) {
          return true;
        }
        return item.label.toLowerCase().includes(filter) || item.id.toLowerCase().includes(filter);
      });

      if (shown.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'No matching items.';
        itemsListHost.appendChild(li);
        return;
      }

      shown.forEach((item) => {
        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.className = 'item-btn';
        if (activeItemId === item.id) {
          btn.classList.add('active');
        }
        btn.dataset.itemId = item.id;
        btn.innerHTML = '<strong>' + escapeHtml(item.label) + '</strong><br><small>' + escapeHtml(item.id) + '</small>';
        btn.addEventListener('click', async () => {
          itemsListHost.querySelectorAll('.item-btn').forEach((node) => node.classList.remove('active'));
          btn.classList.add('active');
          activeItemId = item.id;
          const detail = await fetchJson(
            '/api/category/' + encodeURIComponent(activeCategory) + '/' + encodeURIComponent(item.id)
          );
          renderDetailCard(currentCategoryLabel + ': ' + item.label, detail);
        });
        li.appendChild(btn);
        itemsListHost.appendChild(li);
      });
    };

    const renderItems = async (category, categoryLabel) => {
      activeCategory = category;
      activeItemId = null;
      currentCategoryLabel = categoryLabel;
      itemsTitle.textContent = categoryLabel + ' Items';
      itemSearchInput.value = '';
      setDetail('Item Detail', { hint: 'Select an item from ' + categoryLabel });

      const items = await fetchJson('/api/category/' + encodeURIComponent(category));
      currentItems = Array.isArray(items) ? items : [];

      if (!Array.isArray(items) || items.length === 0) {
        itemsListHost.innerHTML = '';
        const li = document.createElement('li');
        li.textContent = 'No items found.';
        itemsListHost.appendChild(li);
        return;
      }

      renderItemsFromCurrent();
    };

    const renderCategories = async () => {
      const catalog = await fetchJson('/api/catalog');
      categoryButtonsHost.innerHTML = '';

      catalog.categories.forEach((category, index) => {
        const btn = document.createElement('button');
        btn.className = 'category-btn';
        btn.dataset.categoryId = category.id;
        btn.innerHTML =
          '<strong>' + escapeHtml(category.label) + '</strong><br><small>' + category.count + ' records</small>';

        btn.addEventListener('click', async () => {
          categoryButtonsHost.querySelectorAll('.category-btn').forEach((node) => node.classList.remove('active'));
          btn.classList.add('active');
          await renderItems(category.id, category.label);
        });

        categoryButtonsHost.appendChild(btn);

        if (index === 0) {
          btn.classList.add('active');
        }
      });

      const first = catalog.categories[0];
      if (first) {
        await renderItems(first.id, first.label);
      }
    };

    renderCategories().catch((error) => {
      setDetail('Dashboard Error', { error: error.message || String(error) });
    });

    runPipelineButton.addEventListener('click', async () => {
      runPipelineButton.disabled = true;
      runStatusNode.textContent = 'Pipeline status: starting...';
      try {
        await postJson('/api/pipeline/run?source=all');
        await refreshPipelineStatus();
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        runStatusNode.textContent = 'Pipeline status: failed to start (' + message + ')';
        runPipelineButton.disabled = false;
      }
    });

    refreshPipelineStatus().catch(() => {
      runStatusNode.textContent = 'Pipeline status: unavailable';
    });

    setInterval(() => {
      refreshPipelineStatus().catch(() => {});
    }, 3000);

    itemSearchInput.addEventListener('input', () => {
      if (!activeCategory) {
        return;
      }
      renderItemsFromCurrent();
    });

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

async function route(
  req: IncomingMessage,
  res: ServerResponse,
  dataDir: string,
  pipeline: PipelineController
): Promise<void> {
  const parsed = new URL(req.url ?? '/', 'http://127.0.0.1');
  const path = parsed.pathname;
  const method = req.method ?? 'GET';

  if (path === '/healthz') {
    sendJson(res, 200, { ok: true });
    return;
  }

  if (path === '/api/summary') {
    try {
      const summary = await collectPreviewSummary(dataDir);
      sendJson(res, 200, summary);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      sendJson(res, 500, { error: message });
    }
    return;
  }

  if (path === '/api/pipeline/status') {
    sendJson(res, 200, pipeline.status);
    return;
  }

  if (path === '/api/pipeline/run') {
    if (method !== 'POST') {
      sendJson(res, 405, { error: 'method not allowed' });
      return;
    }

    const source = parsed.searchParams.get('source')?.trim() || 'all';
    const started = await pipeline.startRun(source);
    if (!started) {
      sendJson(res, 409, { error: 'pipeline already running', status: pipeline.status });
      return;
    }

    sendJson(res, 202, { ok: true, status: pipeline.status });
    return;
  }

  if (path === '/api/catalog') {
    try {
      const catalog = await buildDashboardCatalog(dataDir);
      sendJson(res, 200, catalog);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      sendJson(res, 500, { error: message });
    }
    return;
  }

  if (path.startsWith('/api/category/')) {
    const segments = path.replace('/api/category/', '').split('/').map((segment) => decodeURIComponent(segment));
    const categoryId = segments[0] ?? '';

    if (!isCategoryId(categoryId)) {
      sendJson(res, 400, { error: 'unknown category' });
      return;
    }

    if (segments.length === 1 || !segments[1]) {
      try {
        const items = await buildCategoryList(dataDir, categoryId);
        sendJson(res, 200, items);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        sendJson(res, 500, { error: message });
      }
      return;
    }

    const itemIdValue = segments[1];
    try {
      const item = await loadCategoryItemById(dataDir, categoryId, itemIdValue);
      if (!item) {
        sendJson(res, 404, { error: 'item not found' });
        return;
      }
      sendJson(res, 200, item);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      sendJson(res, 500, { error: message });
    }
    return;
  }

  if (path === '/' || path === '/index.html') {
    const summary = await collectPreviewSummary(dataDir);
    res.statusCode = 200;
    res.setHeader('content-type', 'text/html; charset=utf-8');
    res.end(buildPreviewHtml(summary));
    return;
  }

  if (path.startsWith('/data/')) {
    const relative = path.replace('/data/', '');
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

export function createPreviewServer(dataDir: string, options: PreviewServerOptions = {}): Server {
  const runPipeline = options.runPipeline ?? (async (source: string) => runCommand({ source }));
  const pipeline = createPipelineController(runPipeline);

  return createServer((req, res) => {
    route(req, res, dataDir, pipeline).catch((error) => {
      const message = error instanceof Error ? error.message : String(error);
      sendJson(res, 500, { error: message });
    });
  });
}

export async function startPreviewServer(dataDir: string, port: number): Promise<Server> {
  const server = createPreviewServer(dataDir);

  await new Promise<void>((resolvePromise, reject) => {
    server.once('error', reject);
    server.listen(port, '127.0.0.1', () => resolvePromise());
  });

  process.on('SIGINT', () => {
    server.close(() => process.exit(0));
  });

  return server;
}
