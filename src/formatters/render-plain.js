import _ from 'lodash';

const getValueContent = (value) => (_.isObject(value) ? '[complex value]' : value);
const plainOperations = {
  unchanged: () => null,
  changed: (node, filepath) => `Property ${filepath}${node.name} was changed from ${node.valueBefore} to ${getValueContent(node.valueAfter)}`,
  added: (node, filepath) => `Property ${filepath}${node.name} was added with value ${getValueContent(node.valueAfter)}`,
  deleted: (node, filepath) => `Property ${filepath}${node.name} was deleted`,
  nested: (node, filepath, func) => {
    const newFilepath = `${filepath}${node.name}.`;
    return func(node.children, newFilepath);
  },
};

export default (ast) => {
  const iter = (tree, filepath) => (
    tree.map((node) => plainOperations[node.type](node, filepath, iter))
  );
  const render = iter(ast, '');
  return _.flattenDeep(render)
    .filter((el) => el !== null)
    .join('\n');
};
