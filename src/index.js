import * as fs from 'fs';
import _ from 'lodash';
import path from 'path';
import yaml from 'js-yaml';

const mapping = {
  json: JSON.parse,
  yaml: yaml.safeLoad,
};

const getType = (filepath) => path.extname(filepath).slice(1).toLowerCase().trim();

const getFileContent = (filepath) => {
  const currentDir = process.cwd();
  const absolutePath = path.resolve(currentDir, filepath);
  return fs.readFileSync(absolutePath, 'utf-8');
};

const fileParse = (filepath) => {
  const currentType = getType(filepath);
  const currentContent = getFileContent(filepath);
  return mapping[currentType](currentContent);
};

export default (filepath1, filepath2) => {
  const fileBefore = fileParse(filepath1);
  const fileAfter = fileParse(filepath2);
  const unionKeys = _.union(Object.keys(fileBefore), Object.keys(fileAfter));
  const diffArrs = unionKeys.reduce((acc, el) => {
    if (_.has(fileBefore, el) && _.has(fileAfter, el)) {
      if (fileBefore[el] === fileAfter[el]) {
        return [...acc, `   ${el}: ${fileAfter[el]}`];
      }
      return [
        ...acc,
        [` + ${[el]}: ${fileAfter[el]}`],
        [` - ${[el]}: ${fileBefore[el]}`],
      ];
    }
    if (_.has(fileBefore, el) && !_.has(fileAfter, el)) {
      return [...acc, ` - ${el}: ${fileBefore[el]}`];
    }
    return [...acc, ` + ${el}: ${fileAfter[el]}`];
  }, []);
  return `{\n${diffArrs.join('\n')}\n}`;
};
