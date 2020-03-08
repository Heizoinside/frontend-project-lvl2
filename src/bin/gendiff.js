#!/usr/bin/env node
import program from 'commander';
import compareFiles from '..';

program
  .version('0.0.3')
  .description('Compares two configuration files and shows a difference.')
  .option('-f --format <type>', 'output format')
  .arguments('<firstConfig> <secondConfig>')
  .action((firstConfig, secondConfig) => {
    console.log(`${firstConfig} ${secondConfig}`);
    const result = compareFiles(firstConfig, secondConfig);
    console.log(result);
  });
program.parse(process.argv);
