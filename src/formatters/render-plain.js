import _ from 'lodash';

const getValueContent = (value) => (_.isObject(value) ? ['[complex value]'] : value);
const plainOperations = {
    unchanged: () => null,
    changed: (node, path) => `Property ${path}${node.name} was changed from ${node.before} to ${getValueContent(node.after)}`,
    added: (node, path) => `Property ${path}${node.name} was added with value ${getValueContent(node.after)}`,
    deleted: (node, path) => `Property ${path}${node.name} was deleted`,
    nested: (node, path, func) => {
        const result = node.children.map((el) => plainOperations[el.type](el, `${path}${node.name}.`, func));
        return result;
    },
};

const plainRender = (ast) => {
    const renderedAst = ast.map((node) => {
        const result = plainOperations[node.type](node, '', plainRender);
        return result;
    });
    return _.flattenDeep(renderedAst)
        .filter((el) => el !== null)
        .join('\n');
};

export default plainRender;
