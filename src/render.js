import * as fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import ini from 'ini';

const mapping = {
  json: JSON.parse,
  yaml: yaml.safeLoad,
  ini: ini.parse,
};

const getType = (filepath) => path.extname(filepath).slice(1).toLowerCase().trim();

const getFileContent = (filepath) => {
  const currentDir = process.cwd();
  const absolutePath = path.resolve(currentDir, filepath);
  return fs.readFileSync(absolutePath, 'utf-8');
};

export default (filepath) => {
  const currentType = getType(filepath);
  const currentContent = getFileContent(filepath);
  return mapping[currentType](currentContent);
};
