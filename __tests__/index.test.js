import path from 'path';
import fs from 'fs';
import compare from '../src';

const formats = ['json', 'yaml', 'ini'];
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

test.each(formats)('compareTree', (ext) => {
    const expected = fs.readFileSync(getFixturePath('result.txt'), 'utf-8');
    const fileBefore = getFixturePath(`before.${ext}`);
    const fileAfter = getFixturePath(`after.${ext}`);
    const format = 'tree';
    const result = compare(format, fileBefore, fileAfter);
    expect(result).toBe(expected);
});

test.each(formats)('comparePlain', (ext) => {
    const expected = fs.readFileSync(getFixturePath('resultPlain.txt'), 'utf-8');
    const fileBefore = getFixturePath(`before.${ext}`);
    const fileAfter = getFixturePath(`after.${ext}`);
    const format = 'plain';
    const result = compare(format, fileBefore, fileAfter);
    expect(result).toBe(expected);
});
