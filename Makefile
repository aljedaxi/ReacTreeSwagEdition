gen-readme:
	grep '^# ' README.tmpl.md > README.md
	jq .license < package.json \
		| sed 's/"//g' \
		| sed 's/\(.*\)/https:\/\/img.shields.io\/badge\/license-\1-brightgreen/' \
		| sed 's/\(.*\)/![license](\1)/' \
		>> README.md
	grep -v '^# ' README.tmpl.md >> README.md
