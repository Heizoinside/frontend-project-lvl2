import parse from './parse';
import buildAst from './ast-builder';
import render from './formatters';

export default (extension, filepathBefore, filepathAfter) => {
    const contentBefore = parse(filepathBefore);
    const contentAfter = parse(filepathAfter);
    const ast = buildAst(contentBefore, contentAfter);
    return render(extension, ast);
};
