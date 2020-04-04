import _ from 'lodash';

const states = [
  {
    condition: (dataBefore, dataAfter, key) => _.has(dataBefore, key)
        && _.has(dataAfter, key)
        && _.isObject(dataBefore[key]) && _.isObject(dataAfter[key]),
    type: 'nested',
    process: (dataBefore, dataAfter, func) => ({ children: func(dataBefore, dataAfter) }),
  },
  {
    condition: (dataBefore, dataAfter, key) => _.has(dataBefore, key)
        && _.has(dataAfter, key) && dataBefore[key] === dataAfter[key],
    type: 'unchanged',
    process: (dataBefore, dataAfter) => ({ valueBefore: dataBefore, valueAfter: dataAfter }),
  },
  {
    condition: (dataBefore, dataAfter, key) => dataBefore[key] !== dataAfter[key]
        && _.has(dataBefore, key)
        && _.has(dataAfter, key),
    type: 'changed',
    process: (dataBefore, dataAfter) => ({ valueBefore: dataBefore, valueAfter: dataAfter }),
  },
  {
    condition: (dataBefore, dataAfter, key) => _.has(dataBefore, key)
        && !_.has(dataAfter, key),
    type: 'deleted',
    process: (dataBefore) => ({ valueBefore: dataBefore }),
  },
  {
    condition: (dataBefore, dataAfter, key) => _.has(dataAfter, key)
        && !_.has(dataBefore, key),
    type: 'added',
    process: (dataBefore, dataAfter) => ({ valueAfter: dataAfter }),
  },
];
const getStateProcess = (dataBefore, dataAfter, key) => (
  states.find(({ condition }) => condition(dataBefore, dataAfter, key))
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
