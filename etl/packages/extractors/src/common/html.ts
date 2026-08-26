import * as cheerio from 'cheerio';
export function loadHtml(html: string) { return cheerio.load(html); }
