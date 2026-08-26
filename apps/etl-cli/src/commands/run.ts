import { buildDatasetCommand } from './build-dataset.js';
import { extractCommand } from './extract.js';
import { fetchCommand } from './fetch.js';
import { reviewCommand } from './review.js';
import { transformCommand } from './transform.js';
import { validateCommand } from './validate.js';

export interface RunCommandOptions {
    source: string;
}

export interface PipelineStageResult {
    stage: 'fetch' | 'extract' | 'transform' | 'validate' | 'review' | 'build-dataset';
    summary: string;
}

export async function runCommand(options: RunCommandOptions): Promise<PipelineStageResult[]> {
    const results: PipelineStageResult[] = [];

    const fetchResult = await fetchCommand({ source: options.source });
    results.push({ stage: 'fetch', summary: `sources=${fetchResult.count}` });

    const extractResult = await extractCommand({ source: options.source });
    results.push({ stage: 'extract', summary: `sources=${extractResult.count}` });

    const transformResult = await transformCommand();
    results.push({ stage: 'transform', summary: `sources=${transformResult.sourceCount} records=${transformResult.recordCount}` });

    const validateResult = await validateCommand();
    results.push({
        stage: 'validate',
        summary: `runes=${validateResult.runes} deities=${validateResult.deities} worlds=${validateResult.worlds}`
    });

    const reviewResult = await reviewCommand();
    results.push({
        stage: 'review',
        summary: `practices=${reviewResult.practices} adjacent=${reviewResult.adjacentSystems} practical_guide=${reviewResult.classificationCounts.practical_guide} adjacent_symbolic_system=${reviewResult.classificationCounts.adjacent_symbolic_system}`
    });

    const buildResult = await buildDatasetCommand();
    results.push({
        stage: 'build-dataset',
        summary: `version=${buildResult.manifest.version} recordCount=${buildResult.manifest.recordCount}`
    });

    return results;
}
