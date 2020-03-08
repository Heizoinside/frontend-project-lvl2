import * as fs from 'fs';
import _ from 'lodash';
import path from 'path';

const mapping = {
  json: JSON.parse,
};

const fileParse = (filepath, type) => mapping[type](filepath);

const getType = (filepath) => path.extname(filepath).slice(1);

const getFile = (filepath) => {
  const currentDir = process.cwd();
  const pathToFile = path.resolve(currentDir, filepath);
  return fs.readFileSync(pathToFile, 'utf-8');
};

const parse = (filepath1, filepath2) => {
  if (getType(filepath1) !== getType(filepath2)) {
    console.log('Файлы имеют разный формат.');
    return false;
  }
  const currentType = getType(filepath1);
  const file1 = getFile(filepath1);
  const file2 = getFile(filepath2);
  const parsed = [file1, file2].map((file) => fileParse(file, currentType));
  return parsed;
};

export default (filepathBefore, filepathAfter) => {
  const [fileBefore, fileAfter] = parse(filepathBefore, filepathAfter);
  const keysBefore = Object.keys(fileBefore);
  const keysAfter = Object.keys(fileAfter);
  const excludedBefore = keysAfter
    .filter((el) => !keysBefore.includes(el))
    .reduce((acc, el) => [...acc, [` + ${[el]}: ${fileAfter[el]}`]], []);
  const diffOfJsons = keysBefore.reduce((acc, el) => {
    if (_.has(fileAfter, el) && fileBefore[el] === fileAfter[el]) {
      return [...acc, [`   ${[el]}: ${fileBefore[el]}`]];
    }
    if (_.has(fileAfter, el) && fileBefore[el] !== fileAfter[el]) {
      return [
        ...acc,
        [` + ${[el]}: ${fileAfter[el]}`],
        [` - ${[el]}: ${fileBefore[el]}`],
      ];
    }
    if (!_.has(fileAfter, el)) {
      return [...acc, [` - ${[el]} : ${fileBefore[el]}`]];
    }
    return acc;
  }, excludedBefore);
  const result = `{\n${diffOfJsons.join('\n')}\n}`;
  console.log(result);
  return result;
};
