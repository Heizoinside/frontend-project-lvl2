install:
	npm install
test:
	npx jest
publish:
	npm publish --dry-run
build:
	npx babel-node src/bin/gendiff.js
lint:
	npx eslint .
