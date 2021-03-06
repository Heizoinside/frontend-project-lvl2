import _ from 'lodash';

const fillSpaces = (spacesCount) => ' '.repeat(spacesCount);

const stringify = (key, value, spaces) => {
  if (!_.isObject(value)) {
    return `${fillSpaces(spaces)}${key}: ${value}`;
  }
  const innerContent = Object.keys(value).map((el) => (
    stringify(el, value[el], spaces + 6)
  )).join('\n');
  return `${fillSpaces(spaces)}${key}: {\n${innerContent}\n${fillSpaces(spaces + 2)}}`;
};

const treeOperations = {
  unchanged: (node, spaces) => stringify(`  ${node.name}`, node.valueBefore, spaces),
  changed: (node, spaces) => {
    const conentBefore = stringify(`- ${node.name}`, node.valueBefore, spaces);
    const contentAfter = stringify(`+ ${node.name}`, node.valueAfter, spaces);
    return `${conentBefore}\n${contentAfter}`;
  },
  added: (node, spaces) => stringify(`+ ${node.name}`, node.valueAfter, spaces),
  deleted: (node, spaces) => stringify(`- ${node.name}`, node.valueBefore, spaces),
  nested: (node, spaces, func) => {
    const childsContent = func(node.children, spaces + 4);
    return `${fillSpaces(spaces + 2)}${node.name}: {\n${childsContent}\n${fillSpaces(spaces + 2)}}`;
  },
};

export default (ast) => {
  const spaceRepeatCount = 2;
  const iter = (tree, spaces) => (
    tree.map((el) => treeOperations[el.type](el, spaces, iter)).join('\n')
  );
  const treeAst = iter(ast, spaceRepeatCount);
  return `{\n${treeAst}\n}`;
};
