import fs from 'fs';
import path from 'path';
import parse from './parse';
import buildAst from './ast-builder';
import render from './formatters';

const getExtension = (filepath) => {
  const dotIndex = 1;
  return path
    .extname(filepath)
    .slice(dotIndex)
    .toLowerCase();
};

const getFileContent = (filepath) => fs.readFileSync(filepath, 'utf-8');

export default (outputFormat = 'tree', filepathBefore, filepathAfter) => {
  const extensionBefore = getExtension(filepathBefore);
  const extensionAfter = getExtension(filepathAfter);
  const fileBefore = getFileContent(filepathBefore);
  const fileAfter = getFileContent(filepathAfter);
  const parsedContentBefore = parse(extensionBefore, fileBefore);
  const parsedContentAfter = parse(extensionAfter, fileAfter);
  const diffTree = buildAst(parsedContentBefore, parsedContentAfter);
  return render(outputFormat, diffTree);
};
