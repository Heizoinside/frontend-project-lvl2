import path from 'path';
import compare from '../src';

const createFilePass = (filepath) => path.join(__dirname, '..', filepath);

test('compareJsons', () => {
  const pathToFileBefore = createFilePass('/__fixtures__/before.json');
  const pathToFileAfter = createFilePass('/__fixtures__/after.json');
  const result = `{
   host: hexlet.io
 + timeout: 20
 - timeout: 50
 - proxy: 123.234.53.22
 - follow: false
 + verbose: true
}`;
  expect(compare(pathToFileBefore, pathToFileAfter)).toEqual(result);
});
