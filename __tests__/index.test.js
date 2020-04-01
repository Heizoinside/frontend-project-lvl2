import path from 'path';
import fs from 'fs';
import compare from '../src';

const formats = [
  ['json', 'tree'],
  ['yaml', 'tree'],
  ['ini', 'tree'],
  ['json', 'plain'],
  ['yaml', 'plain'],
  ['ini', 'plain'],
  ['json', 'json'],
];
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

test.each(formats)('compare', (ext, format) => {
  const expected = fs.readFileSync(getFixturePath(`result-${format}.txt`), 'utf-8');
  const fileBefore = getFixturePath(`before.${ext}`);
  const fileAfter = getFixturePath(`after.${ext}`);
  const result = compare(format, fileBefore, fileAfter);
  expect(result).toBe(expected);
});
