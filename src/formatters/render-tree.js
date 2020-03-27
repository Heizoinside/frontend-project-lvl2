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
        const childsContent = node.children.map((el) => treeOperations[el.type](el, spaces + 3, func)).join('\n');
        return `${fillSpaces(spaces + 2)}${node.name}: {\n${childsContent}\n${fillSpaces(spaces + 2)}}`;
    },
};

const renderTree = (ast) => {
    const treeAst = ast.map((el) => treeOperations[el.type](el, spaceRepeatCount, renderTree)).join('\n');
    return `{\n${treeAst}\n}`;
};

export default renderTree;
