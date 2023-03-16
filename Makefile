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
		| sed 's/\(.*\)/![version](\1)/' \
		>> README.md
	grep -v '^# ' README.tmpl.md >> README.md
