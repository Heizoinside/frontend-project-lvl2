import _ from 'lodash';

const fillSpaces = (spacesCount) => ' '.repeat(spacesCount);
const spaceRepeatCount = 0;

const stringify = (key, value, spaces) => {
    if (!_.isObject(value)) {
        return `${fillSpaces(spaces)}${key}: ${value}`;
    }
    const innerContent = Object.keys(value).map((el) => (
        stringify(el, value[el], spaces + 5)
    ));
    return `${fillSpaces(spaces)}${key}: {\n${innerContent}\n${fillSpaces(spaces + 2)}}`;
};

const operations = {
    unchanged: (node, spaces) => stringify(`  ${node.name}`, node.before, spaces),
    changed: (node, spaces) => {
        const conentBefore = stringify(`- ${node.name}`, node.before, spaces);
        const contentAfter = stringify(`+ ${node.name}`, node.after, spaces);
        return `${conentBefore}\n${contentAfter}`;
    },
    added: (node, spaces) => stringify(`+ ${node.name}`, node.after, spaces),
    deleted: (node, spaces) => stringify(`- ${node.name}`, node.before, spaces),
    nested: (node, spaces, func) => {
        const childsContent = node.children.map((el) => operations[el.type](el, spaces + 3, func)).join('\n');
        return `${fillSpaces(spaces + 2)}${node.name}: {\n${childsContent}\n${fillSpaces(spaces + 2)}}`;
    },
};

const render = (ast) => {
    const processedAst = ast.map((el) => operations[el.type](el, spaceRepeatCount, render)).join('\n');
    return `{\n${processedAst}\n}`;
};

export default render;
