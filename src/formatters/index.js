import treeRender from './render-tree';
import plainRender from './render-plain';

const formats = {
    tree: (ast) => treeRender(ast),
    plain: (ast) => plainRender(ast),
};

export default (format, ast) => formats[format](ast);
