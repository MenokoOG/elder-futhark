import { describe, expect, it, vi } from 'vitest';

vi.mock('./fetch.js', () => ({
    fetchCommand: vi.fn(async () => ({ count: 2, paths: [] }))
}));

vi.mock('./extract.js', () => ({
    extractCommand: vi.fn(async () => ({ count: 2, paths: [] }))
}));

vi.mock('./transform.js', () => ({
    transformCommand: vi.fn(async () => ({ sourceCount: 2, recordCount: 4, paths: [] }))
}));

vi.mock('./validate.js', () => ({
    validateCommand: vi.fn(async () => ({
        runes: 1,
        deities: 2,
        worlds: 1,
        practices: 1,
        adjacentSystems: 1,
        paths: []
    }))
}));

vi.mock('./review.js', () => ({
    reviewCommand: vi.fn(async () => ({
        runes: 1,
        deities: 2,
        worlds: 1,
        practices: 1,
        adjacentSystems: 1,
        classificationCounts: {
            reference_like: 3,
            practical_guide: 1,
            modern_interpretation: 0,
            adjacent_symbolic_system: 1
        },
        paths: []
    }))
}));

vi.mock('./build-dataset.js', () => ({
    buildDatasetCommand: vi.fn(async () => ({
        manifest: { version: '0.1.0', builtAt: '2026-04-11T00:00:00.000Z', sourceCount: 2, recordCount: 4 },
        paths: []
    }))
}));

import { runCommand } from './run.js';

describe('runCommand', () => {
    it('runs pipeline stages in order and returns summaries', async () => {
        const result = await runCommand({ source: 'all' });

        expect(result.map((item) => item.stage)).toEqual([
            'fetch',
            'extract',
            'transform',
            'validate',
            'review',
            'build-dataset'
        ]);

        expect(result[0]?.summary).toContain('sources=2');
        expect(result[5]?.summary).toContain('recordCount=4');
    });
});
