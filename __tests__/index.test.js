import path from 'path';
import fs from 'fs';
import compare from '../src';

const formats = ['json', 'yaml', 'ini'];
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

test.each(formats)('compare', (ext) => {
  const expected = fs.readFileSync(getFixturePath('result.txt'), 'utf-8');
  const fileBefore = getFixturePath(`before.${ext}`);
  const fileAfter = getFixturePath(`after.${ext}`);
  const result = compare(fileBefore, fileAfter);
  expect(result).toBe(expected);
});
