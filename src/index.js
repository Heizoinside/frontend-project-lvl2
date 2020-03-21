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

const makeTab = (tabCount) => ' '.repeat(tabCount);

const stringify = (key, value, tab) => {
  if (!_.isObject(value)) {
    return `${makeTab(tab)}${key}: ${value}`;
  }
  const innerContent = Object.keys(value).map((el) => (
    stringify(el, value[el], tab + 5)
  ));
  return `${makeTab(tab)}${key}: {\n${innerContent}\n${makeTab(tab + 2)}}`;
};

const operations = {
  unchanged: (node, tab) => stringify(`  ${node.name}`, node.before, tab),
  changed: (node, tab) => {
    const conentBefore = stringify(`- ${node.name}`, node.before, tab);
    const contentAfter = stringify(`+ ${node.name}`, node.after, tab);
    return `${conentBefore}\n${contentAfter}`;
  },
  added: (node, tab) => stringify(`+ ${node.name}`, node.after, tab),
  deleted: (node, tab) => stringify(`- ${node.name}`, node.before, tab),
  nested: (node, tab, func) => {
    const childsContent = node.children.map((el) => operations[el.type](el, tab + 3, func)).join('\n');
    return `${makeTab(tab + 2)}${node.name}: {\n${childsContent}\n${makeTab(tab + 2)}}`;
  },
};

const render = (ast) => (
  ast.map((el) => operations[el.type](el, 0, render)).join('\n')
);

export default (filepath1, filepath2) => {
  const fileBefore = parse(filepath1);
  const fileAfter = parse(filepath2);
  const ast = buildAst(fileBefore, fileAfter);
  console.log(render(ast));
  return render(ast);
};
