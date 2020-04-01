import yaml from 'js-yaml';
import ini from 'ini';

const mapping = {
  json: JSON.parse,
  yaml: yaml.safeLoad,
  yml: yaml.safeLoad,
  ini: ini.parse,
};

export default (extension, content) => mapping[extension](content);
