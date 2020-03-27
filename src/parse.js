import * as fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import ini from 'ini';

const dotIndex = 1;
const getExtension  = (filepath) => path.extname(filepath).slice(dotIndex).toLowerCase().trim();
const getFileContent = (filepath) => fs.readFileSync(filepath, 'utf-8');

const mapping = {
    json: JSON.parse,
    yaml: yaml.safeLoad,
    yml: yaml.safeLoad,
    ini: ini.parse,
};

export default (filepath) => {
    const extension = getExtension(filepath);
    const content = getFileContent(filepath);
    return mapping[extension](content);
};
