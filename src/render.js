import _ from 'lodash';

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

export default render;
