import debug from 'debug'
import { Node } from 'ts-morph'

function createLogger(fnOnly: Function, prefix?: string) {
	if (fnOnly !== undefined && typeof fnOnly !== 'function') {
		throw new Error('fnOnly must be a function')
	}

	const _prefix = prefix ? `${prefix}:${fnOnly.name}` : fnOnly.name

	return {
		verbose: debug(`${_prefix}:verbose`),
		info: debug(`${_prefix}:info`),
		warning: debug(`${_prefix}:warning`),
		error: debug(`${_prefix}:error`),

		child: (fn: Function) => createLogger(fn, _prefix),
	}
}

export function createFunctionLogger(fnOnly: Function) {
	return createLogger(fnOnly)
}

export function getNodePos(node: Node) {
	return `${node
		.getSourceFile()
		.getFilePath()}:${node.getStartLineNumber()}:${node.getStartLinePos()}`
}
