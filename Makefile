gen-readme:
	grep '^# ' README.tmpl.md > README.md
	jq .license < package.json \
		| sed 's/"//g' \
		| sed 's/\(.*\)/https:\/\/img.shields.io\/badge\/license-\1-brightgreen/' \
		| sed 's/\(.*\)/![license](\1)/' \
		>> README.md
	jq .version < package.json \
		| sed 's/"//g' \
		| sed 's/\(.*\)/https:\/\/img.shields.io\/badge\/npm-v\1-blue/' \
		| sed 's/\(.*\)/![version](\1)/' \
		>> README.md
	echo 'passing' \
		| sed 's/\(.*\)/https:\/\/img.shields.io\/badge\/build-\1-success/' \
		| sed 's/\(.*\)/![tests passing](\1)/' \
		>> README.md
	grep -v '^# ' README.tmpl.md >> README.md

test-cli:
	echo src/test/test_apps/test_8/index.js | out/cli.js -p prop1 | out/cli.js -i
	out/cli.js src/test/test_apps/test_8/index.js | out/cli.js -i

SEVERITY ?= patch
version:
	npm version ${SEVERITY}

publish: version gen-readme
	git add README.md && git commit --amend && git push
	npm publish
