import { Command } from 'commander';
import { extractCommand } from './commands/extract.js';
import { fetchCommand } from './commands/fetch.js';
import { previewCommand } from './commands/preview.js';
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
program.command('build-dataset').action(() => printStage('build-dataset', 'Dataset build stage placeholder'));
program
    .command('preview')
    .option('--port <port>', 'preview server port', '4173')
    .action(async (opts: { port: string }) => {
        const result = await previewCommand({ port: opts.port });
        printStage('preview', `Serving ETL preview at ${result.url}`);
        printStage('preview', 'Press Ctrl+C to stop');
    });
await program.parseAsync(process.argv);
