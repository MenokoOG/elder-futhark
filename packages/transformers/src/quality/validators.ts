export function ensureNonEmptyArray<T>(input: T[]): T[] {
    if (input.length === 0) {
        throw new Error('Expected non-empty array');
    }

    return input;
}
