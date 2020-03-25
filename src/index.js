import parse from './parse';
import buildAst from './astBuilder';
import render from './formatters';

export default (format, filepath1, filepath2) => {
    const fileBefore = parse(filepath1);
    const fileAfter = parse(filepath2);
    const ast = buildAst(fileBefore, fileAfter);
    return render(format, ast);
};
