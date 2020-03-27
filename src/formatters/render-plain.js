import _ from 'lodash';

const getValueContent = (value) => (_.isObject(value) ? ['[complex value]'] : value);
const plainOperations = {
    unchanged: () => null,
    changed: (node, filepath) => `Property ${filepath}${node.name} was changed from ${node.valueBefore} to ${getValueContent(node.valueAfter)}`,
    added: (node, filepath) => `Property ${filepath}${node.name} was added with value ${getValueContent(node.valueAfter)}`,
    deleted: (node, filepath) => `Property ${filepath}${node.name} was deleted`,
    nested: (node, filepath, func) => {
        const result = node.children.map((el) => plainOperations[el.type](el, `${filepath}${node.name}.`, func));
        return result;
    },
};

const plainRender = (ast) => {
    const processedAst = ast.map((node) => {
        const result = plainOperations[node.type](node, '', plainRender);
        return result;
    });
    return _.flattenDeep(processedAst)
        .filter((el) => el !== null)
        .join('\n');
};

export default plainRender;
