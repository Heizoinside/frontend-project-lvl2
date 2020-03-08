import compare from '../src';


test('compareJsons', () => {
  const pathToFileBefore = '__tests__/__fixtures__/before.json';
  const pathToFileAfter = '__tests__/__fixtures__/after.json';
  const result = `{
 + verbose: true
   host: hexlet.io
 + timeout: 20
 - timeout: 50
 - proxy : 123.234.53.22
 - follow : false
}`;
  expect(compare(pathToFileBefore, pathToFileAfter)).toEqual(result);
});
