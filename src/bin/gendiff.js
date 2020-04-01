#!/usr/bin/env node
import program from 'commander';
import path from 'path';
import compareFiles from '..';

const getAbsolutePath = (filepath) => {
  const currentDir = process.cwd();
  return path.resolve(currentDir, filepath);
};

program
  .version('0.0.3')
  .description('Compares two configuration files and shows a difference.')
  .option('-f --format <type>', 'output format (tree, plain, json)')
  .arguments('<firstConfig> <secondConfig>')
  .action((firstConfig, secondConfig) => {
    const firstFile = getAbsolutePath(firstConfig);
    const secondFile = getAbsolutePath(secondConfig);
    const result = compareFiles(program.format, firstFile, secondFile);
    console.log(result);
  });
program.parse(process.argv);
