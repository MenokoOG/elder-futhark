const ALLOWED_HOSTS = new Set(['norse-mythology.org', 'andreashelley.com']);
export function assertAllowlistedUrl(rawUrl: string): void {
    let url: URL;

    try {
        url = new URL(rawUrl);
    } catch {
        throw new Error(`Invalid URL: ${rawUrl}`);
    }

    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        throw new Error(`Unsupported protocol for URL: ${rawUrl}`);
    }

    if (!ALLOWED_HOSTS.has(url.hostname)) {
        throw new Error(`URL host not allowlisted: ${url.hostname}`);
    }
}
