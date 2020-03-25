import * as fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import ini from 'ini';

const mapping = {
    json: JSON.parse,
    yaml: yaml.safeLoad,
    ini: ini.parse,
};

const dotIndex = 1;
const getType = (filepath) => path.extname(filepath).slice(dotIndex).toLowerCase().trim();

const getFileContent = (filepath) => fs.readFileSync(filepath, 'utf-8');

export default (filepath) => {
    const currentType = getType(filepath);
    const currentContent = getFileContent(filepath);
    return mapping[currentType](currentContent);
};
