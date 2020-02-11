#!/usr/bin/env node

import program from 'commander';
import compareFiles from '..';

program
  .version('0.0.3')
  .description('Compares two configuration files and shows a difference.')
  .option('-f --format <type>', 'output format')
  .arguments('<path1> <path2>')
  .action((path1, path2) => {
    console.log(`${path1} ${path2}`);
    const result = compareFiles(path1, path2);
    console.log(result);
  });
program.parse(process.argv);

console.log('hello');
