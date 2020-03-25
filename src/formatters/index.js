import treeRender from './render-tree';
import plainRender from './render-plain';
import jsonRender from './render-json';

const formats = {
    tree: (ast) => treeRender(ast),
    plain: (ast) => plainRender(ast),
    json: (ast) => jsonRender(ast),
};

export default (format, ast) => formats[format](ast);
