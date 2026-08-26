export function resolveAlias(input: string): string {
    return input
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

export function aliasFromSourceUrl(sourceUrl: string, fallback: string): string {
    try {
        const parsed = new URL(sourceUrl);
        const segments = parsed.pathname.split('/').filter(Boolean);
        const tail = segments[segments.length - 1];

        if (!tail) {
            return resolveAlias(fallback);
        }

        return resolveAlias(tail);
    } catch {
        return resolveAlias(fallback);
    }
}

export function displayNameFromSourceUrl(title: string, sourceUrl: string): string {
    const normalizedTitle = title.trim();
    if (normalizedTitle.length > 0 && !/^norse mythology for smart people$/i.test(normalizedTitle)) {
        return normalizedTitle;
    }

    try {
        const parsed = new URL(sourceUrl);
        const segments = parsed.pathname.split('/').filter(Boolean);
        const tail = segments[segments.length - 1];
        if (!tail) {
            return normalizedTitle || 'Unknown';
        }

        return tail
            .split('-')
            .filter(Boolean)
            .map((part) => part.slice(0, 1).toUpperCase() + part.slice(1))
            .join(' ');
    } catch {
        return normalizedTitle || 'Unknown';
    }
}
