import parse from './parse';
import buildAst from './astBuilder';
import treeRender from './render';
import plainRender from './plainRender';

const formats = {
    tree: (ast) => treeRender(ast),
    plain: (ast) => plainRender(ast),
};

export default (format, filepath1, filepath2) => {
    const fileBefore = parse(filepath1);
    const fileAfter = parse(filepath2);
    const ast = buildAst(fileBefore, fileAfter);
    const result = formats[format](ast);
    return result;
};
