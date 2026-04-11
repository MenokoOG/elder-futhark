import { Command } from 'commander';
import { fetchCommand } from './commands/fetch.js';
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
program.command('extract').option('--source <source>', 'source registry key or all', 'all').action((opts) => printStage('extract', `Extract stage placeholder for source=${opts.source}`));
program.command('transform').action(() => printStage('transform', 'Transform stage placeholder'));
program.command('validate').action(() => printStage('validate', 'Validate stage placeholder'));
program.command('build-dataset').action(() => printStage('build-dataset', 'Dataset build stage placeholder'));
await program.parseAsync(process.argv);
