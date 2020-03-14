import path from 'path';
import compare from '../src';

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const formats = ['json', 'yaml'];
const result = `{
   host: hexlet.io
 + timeout: 20
 - timeout: 50
 - proxy: 123.234.53.22
 - follow: false
 + verbose: true
}`;

test.each(formats)('compare', (ext) => {
  const fileBefore = getFixturePath(`before.${ext}`);
  const fileAfter = getFixturePath(`after.${ext}`);
  expect(compare(fileBefore, fileAfter)).toEqual(result);
});
