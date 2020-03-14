import path from 'path';
import compare from '../src';

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

const result = `{
   host: hexlet.io
 + timeout: 20
 - timeout: 50
 - proxy: 123.234.53.22
 - follow: false
 + verbose: true
}`;

test('compareJsons', () => {
  const jsonBefore = getFixturePath('before.json');
  const jsonAfter = getFixturePath('after.json');
  expect(compare(jsonBefore, jsonAfter)).toEqual(result);
});
test('compareYaml', () => {
  const yamlBefore = getFixturePath('before.yaml');
  const yamlAfter = getFixturePath('after.yaml');
  expect(compare(yamlBefore, yamlAfter)).toEqual(result);
});
