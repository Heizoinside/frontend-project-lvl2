import _ from 'lodash';
import parse from './render';

const states = [
  {
    condition: (fileBefore, fileAfter, key) => _.has(fileBefore, key)
      && _.has(fileAfter, key) && fileBefore[key] === fileAfter[key],
    type: 'unchanged',
    process: (fileBefore, fileAfter) => ({ before: fileBefore, after: fileAfter }),
  },
  {
    condition: (fileBefore, fileAfter, key) => _.has(fileBefore, key)
      && _.has(fileAfter, key)
      && _.isObject(fileBefore[key]) && _.isObject(fileAfter[key]),
    type: 'nested',
    process: (fileBefore, fileAfter, func) => ({ children: func(fileBefore, fileAfter) }),
  },
  {
    condition: (fileBefore, fileAfter, key) => _.has(fileBefore, key)
      && _.has(fileAfter, key)
      && fileBefore[key] !== fileAfter[key],
    type: 'changed',
    process: (fileBefore, fileAfter) => ({ before: fileBefore, after: fileAfter }),
  },
  {
    condition: (fileBefore, fileAfter, key) => _.has(fileBefore, key)
      && !_.has(fileAfter, key),
    type: 'deleted',
    process: (fileBefore) => ({ before: fileBefore }),
  },
  {
    condition: (fileBefore, fileAfter, key) => _.has(fileAfter, key)
      && !_.has(fileBefore, key),
    type: 'added',
    process: (fileBefore, fileAfter) => ({ after: fileAfter }),
  },
];
const getStateAction = (fileBefore, fileAfter, key) => (
  states.find(({ condition }) => condition(fileBefore, fileAfter, key))
);

const buildAst = (obj1, obj2) => {
  const unionKeys = _.union(Object.keys(obj1), Object.keys(obj2));
  return unionKeys.sort().map((key) => {
    const { type, process } = getStateAction(obj1, obj2, key);
    const values = process(obj1[key], obj2[key], buildAst);
    const root = {
      name: key,
      type,
      ...values,
    };
    return root;
  });
};

const operators = {
  unchanged: (node) => `  ${node.name}: ${node.before}`,
  changed: (node) => `- ${node.name}: ${node.before} \n+ ${node.name}:${node.after}`,
  added: (node) => `+ ${node.name}: ${node.after}`,
  deleted: (node) => `- ${node.name}: ${node.before}`,
  nested: (node, func) => ` ${node.name}:\n${func(node.children)}`,
};

const render = (ast) => (
  ast.map((el) => operators[el.type](el, render)).join('\n')
);

export default (filepath1, filepath2) => {
  const fileBefore = parse(filepath1);
  const fileAfter = parse(filepath2);
  const ast = buildAst(fileBefore, fileAfter);
  console.log(render(ast));
  return render(ast);
};
