export function buildUserAgent(appName = 'elder-futhark-etl', version = '0.1.0'): string { return `${appName}/${version} (+respectful, allowlisted, low-concurrency fetcher)`; }
