install:
	npm install
test:
	npm test
testWatch:
	npx jest --watch
publish:
	npm publish --dry-run
start:
	npx babel-node src/bin/gendiff.js
lint:
	npx eslint .
