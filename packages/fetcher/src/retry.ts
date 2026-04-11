export async function withRetry<T>(fn: () => Promise<T>, retries = 2): Promise<T> {
    let lastError: unknown;

    for (let attempt = 0; attempt <= retries; attempt += 1) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;
            if (attempt === retries) {
                break;
            }
        }
    }

    throw lastError;
}
