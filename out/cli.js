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
		propKeys: {
			type: 'string',
			multiple: true,
			short: 'p',
			default: [],
			description: 'which prop keys to keep',
		},
		help: {
			type: 'boolean',
			short: 'h',
			description: 'show this helpful help',
		},
		inverse: {
			type: 'boolean',
			short: 'i',
			description: 'turn json into jsx',
			default: false,
		},
		commentKeys: {
			type: 'string',
			multiple: true,
			short: 'c',
			default: [],
			description: 'print key values pairs as comments above component. same options as --keys',
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

const propKeys = new Set(values.propKeys)
const parseFile = filePath => {
	const parser = new Parser(filePath)
	const tree = parser.parse()
	// here for reference
	for (const component of recurse(tree)) {
		const {props, ...rest} = component
		const componentRepresentation = propKeys.size > 0
			? {props: pick(propKeys)(props), ...rest}
			: {props, ...rest}
		console.log(JSON.stringify(componentRepresentation))
	}
}

const jsxVal = v => 
	typeof v === 'string' ? `='${v.replace(/'/g, "\\'")}'`
	:      v === true     ? ''
  :                       `={${JSON.stringify(v)}}`

const inverseMain = jsonString => {
	const json = JSON.parse(jsonString)
	const {id, name, props, ...rest} = json
	values.commentKeys.forEach(k => console.log(`\/\/ {"${k}": ${JSON.stringify(json[k])}}`))
	console.log(
		`<${name} ${
			Object.entries(props)
				.map(([k, v]) => `${k}${jsxVal(v)}`)
				.join(' ')
		}/>`
	)
}

if (positionals.length > 0) {
	if (values.inverse) {
		console.error("can't be inverse and have positional arguments")
		process.exit(-1)
	}
	positionals.forEach(parseFile)
} else {
	const readInterface = readline.createInterface({input: stdin, output: stdout})
	readInterface.on('line', values.inverse ? inverseMain : parseFile)
}
