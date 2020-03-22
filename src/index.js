import parse from './parse';
import buildAst from './astBuilder';
import render from './render';

export default (filepath1, filepath2) => {
    const fileBefore = parse(filepath1);
    const fileAfter = parse(filepath2);
    const ast = buildAst(fileBefore, fileAfter);
    const result = render(ast);
    console.log(result);
    return result;
};
