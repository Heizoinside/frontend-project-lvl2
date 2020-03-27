import renderTree from './render-tree';
import renderPlain from './render-plain';
import renderJson from './render-json';

const extensions = {
    tree: (ast) => renderTree(ast),
    plain: (ast) => renderPlain(ast),
    json: (ast) => renderJson(ast),
};

export default (ext, ast) => extensions[ext](ast);
