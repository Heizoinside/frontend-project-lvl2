import * as fs from 'fs';
import path from 'path';
import parse from './parse';
import buildAst from './ast-builder';
import render from './formatters';

const getExtension = (filepath) => {
  const dotIndex = 1;
  return path
    .extname(filepath)
    .slice(dotIndex)
    .toLowerCase()
    .trim();
};

const getFileContent = (filepath) => fs.readFileSync(filepath, 'utf-8');

export default (outputFormat = 'tree', filepathBefore, filepathAfter) => {
  const extensionBefore = getExtension(filepathBefore);
  const extensionAfter = getExtension(filepathAfter);
  if (extensionBefore !== extensionAfter) {
    throw new Error('Input formats must be the same');
  }
  const fileBefore = getFileContent(filepathBefore);
  const fileAfter = getFileContent(filepathAfter);
  const parsedContentBefore = parse(extensionBefore, fileBefore);
  const parsedContentAfter = parse(extensionAfter, fileAfter);
  const ast = buildAst(parsedContentBefore, parsedContentAfter);
  return render(outputFormat, ast);
};
