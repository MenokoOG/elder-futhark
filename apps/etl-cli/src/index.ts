import { Command } from 'commander';
import { buildDatasetCommand } from './commands/build-dataset.js';
import { diffCommand } from './commands/diff.js';
import { extractCommand } from './commands/extract.js';
import { fetchCommand } from './commands/fetch.js';
import { previewCommand } from './commands/preview.js';
import { reviewCommand } from './commands/review.js';
import { runCommand } from './commands/run.js';
import { transformCommand } from './commands/transform.js';
import { validateCommand } from './commands/validate.js';
import { printBanner, printStage } from './ui/console.js';

const program = new Command();
program.name('efa-cli').description('Elder Futhark ETL CLI').version('0.1.0');
program.command('doctor').description('Verify local operator setup').action(() => { printBanner(); printStage('doctor', 'Workspace scaffold is present.'); });
program
    .command('fetch')
    .option('--source <source>', 'source registry key or all', 'all')
    .action(async (opts: { source: string }) => {
        const result = await fetchCommand({ source: opts.source });
        printStage('fetch', `Fetched ${result.count} source(s)`);
        for (const path of result.paths) {
            printStage('fetch', `wrote ${path}`);
        }
    });
program
    .command('extract')
    .option('--source <source>', 'source registry key or all', 'all')
    .action(async (opts: { source: string }) => {
        const result = await extractCommand({ source: opts.source });
        printStage('extract', `Extracted ${result.count} source(s)`);
        for (const path of result.paths) {
            printStage('extract', `wrote ${path}`);
        }
    });
program.command('transform').action(async () => {
    const result = await transformCommand();
    printStage('transform', `Transformed ${result.sourceCount} source(s), ${result.recordCount} extracted record(s)`);
    for (const path of result.paths) {
        printStage('transform', `wrote ${path}`);
    }
});
program.command('validate').action(async () => {
    const result = await validateCommand();
    printStage(
        'validate',
        `Validated runes=${result.runes}, deities=${result.deities}, worlds=${result.worlds}, practices=${result.practices}, adjacent=${result.adjacentSystems}`
    );
    for (const path of result.paths) {
        printStage('validate', `checked ${path}`);
    }
});
program.command('build-dataset').action(async () => {
    const result = await buildDatasetCommand();
    printStage(
        'build-dataset',
        `Published dataset version=${result.manifest.version} sourceCount=${result.manifest.sourceCount} recordCount=${result.manifest.recordCount}`
    );
    for (const path of result.paths) {
        printStage('build-dataset', `wrote ${path}`);
    }
});
program.command('diff').action(async () => {
    const result = await diffCommand();

    for (const collection of result.collections) {
        printStage(
            'diff',
            `${collection.collection}: normalized=${collection.normalizedCount} published=${collection.publishedCount} added=${collection.added.length} removed=${collection.removed.length} changed=${collection.changed.length} unchanged=${collection.unchangedCount}`
        );
    }

    if (result.hasChanges) {
        printStage('diff', 'Differences detected between normalized and published artifacts.');
        return;
    }

    printStage('diff', 'No differences detected between normalized and published artifacts.');
});
program.command('review').action(async () => {
    const result = await reviewCommand();

    printStage(
        'review',
        `canonical runes=${result.runes} deities=${result.deities} worlds=${result.worlds} practices=${result.practices} adjacent=${result.adjacentSystems}`
    );
    printStage(
        'review',
        `classifications reference_like=${result.classificationCounts.reference_like} practical_guide=${result.classificationCounts.practical_guide} modern_interpretation=${result.classificationCounts.modern_interpretation} adjacent_symbolic_system=${result.classificationCounts.adjacent_symbolic_system}`
    );
    for (const path of result.paths) {
        printStage('review', `checked ${path}`);
    }
});
program
    .command('preview')
    .option('--port <port>', 'preview server port', '4173')
    .action(async (opts: { port: string }) => {
        const result = await previewCommand({ port: opts.port });
        printStage('preview', `Serving ETL preview at ${result.url}`);
        printStage('preview', 'Press Ctrl+C to stop');
    });
program
    .command('run')
    .description('Run full ETL pipeline fetch->extract->transform->validate->build-dataset')
    .option('--source <source>', 'source registry key or all', 'all')
    .action(async (opts: { source: string }) => {
        const results = await runCommand({ source: opts.source });
        for (const result of results) {
            printStage('run', `${result.stage}: ${result.summary}`);
        }
    });
await program.parseAsync(process.argv);
