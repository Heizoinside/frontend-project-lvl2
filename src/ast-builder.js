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
        process: (fileBefore, fileAfter) => ({ before: fileBefore, after: fileAfter }),
    },
    {
        condition: (fileBefore, fileAfter, key) => fileBefore[key] !== fileAfter[key]
        && _.has(fileBefore, key)
        && _.has(fileAfter, key),
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

export default buildAst;
