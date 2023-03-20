#!/usr/bin/env node
const fs = require('fs')
const readline = require('readline/promises')
const {stdin, stdout} = require('node:process')
const {Parser} = require('./index.js')
const {parseArgs} = require('node:util')

const keysYouCantLiveWithout = ['name', 'id']
const defaultKeys = ['filePath', 'importPath', 'props', 'parentList']
const allKeys = new Set(['fileName', 'expanded', 'depth', 'thirdParty', 'reactRouter', 'reduxConnect', 'count', 'children', 'id', 'name', 'filePath', 'importPath', 'props', 'parentList'])
const options = {
	strict: true,
	allowPositionals: true,
	options: {
		keys: {
			type: 'string',
			multiple: true,
			short: 'k',
			default: defaultKeys,
			description: `component properties to keep. options are\n             ${[...allKeys]}`,
		},
		help: {
			type: 'boolean',
			short: 'h',
			description: 'show this helpful help',
		}
	}
}

const {values, positionals} = parseArgs({...options})
if (values.help) {
	console.log([
		'filteract',
		'',
		'You may pass in filepaths either positionally or on stdin.',
		'',
		'You may pass the following options:',
		...Object.entries(options.options).map(([k, {multiple, short, description}]) =>
			`-${short}, --${k}   ${description}` 
		),
	].join('\n'))
	process.exit()
}

const keysToKeep = new Set([...values.keys, ...keysYouCantLiveWithout])
// const allKeys = new Set(['fileName', 'expanded', 'depth', 'thirdParty', 'reactRouter', 'reduxConnect', 'count', 'children', 'id', 'name', 'filePath', 'importPath', 'props', 'parentList'])
// const keysToNotKeep = new Set([...allKeys].filter(k => !keysToKeep.has(k)))

const pick = keys => o => Object.fromEntries(
	Object.entries(o).filter(([k]) => keys.has(k))
)

const recurse = function*(tree) {
	yield pick(new Set([...keysToKeep, 'parentId']))(tree)
	for (const child of tree.children) {
		yield* recurse({...child, parentId: tree.id})
	}
}

const parseFile = filePath => {
	const parser = new Parser(filePath)
	const tree = parser.parse()
	// here for reference
	for (const component of recurse(tree)) {
		console.log(JSON.stringify(component))
	}
}
if (positionals.length > 0) {
	positionals.forEach(parseFile)
} else {
	const readInterface = readline.createInterface({input: stdin, output: stdout})
	readInterface.on('line', parseFile)
}
