import _ from 'lodash';

const states = [
  {
    condition: (fileBefore, fileAfter, key) => _.has(fileBefore, key)
        && _.has(fileAfter, key)
        && _.isObject(fileBefore[key]) && _.isObject(fileAfter[key]),
    type: 'nested',
    process: (fileBefore, fileAfter, func) => ({ children: func(fileBefore, fileAfter) }),
  },
  {
    condition: (fileBefore, fileAfter, key) => _.has(fileBefore, key)
        && _.has(fileAfter, key) && fileBefore[key] === fileAfter[key],
    type: 'unchanged',
    process: (fileBefore, fileAfter) => ({ valueBefore: fileBefore, valueAfter: fileAfter }),
  },
  {
    condition: (fileBefore, fileAfter, key) => fileBefore[key] !== fileAfter[key]
        && _.has(fileBefore, key)
        && _.has(fileAfter, key),
    type: 'changed',
    process: (fileBefore, fileAfter) => ({ valueBefore: fileBefore, valueAfter: fileAfter }),
  },
  {
    condition: (fileBefore, fileAfter, key) => _.has(fileBefore, key)
        && !_.has(fileAfter, key),
    type: 'deleted',
    process: (fileBefore) => ({ valueBefore: fileBefore }),
  },
  {
    condition: (fileBefore, fileAfter, key) => _.has(fileAfter, key)
        && !_.has(fileBefore, key),
    type: 'added',
    process: (fileBefore, fileAfter) => ({ valueAfter: fileAfter }),
  },
];
const getStateProcess = (fileBefore, fileAfter, key) => (
  states.find(({ condition }) => condition(fileBefore, fileAfter, key))
);

const buildAst = (objBefore, objAfter) => {
  const unionKeys = _.union(Object.keys(objBefore), Object.keys(objAfter));
  return unionKeys.sort().map((key) => {
    const { type, process } = getStateProcess(objBefore, objAfter, key);
    const values = process(objBefore[key], objAfter[key], buildAst);
    const node = {
      name: key,
      type,
      ...values,
    };
    return node;
  });
};

export default buildAst;
