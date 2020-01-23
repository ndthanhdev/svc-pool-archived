import debug from 'debug'
import { Node } from 'ts-morph'

type LogPrefix = Function | string;

function _createLogger(logPrefix: LogPrefix, parentPrefix?: string) {
  let prefix = typeof logPrefix === "function" ? logPrefix.name : logPrefix;

  if (parentPrefix) {
    prefix = `${parentPrefix}:${prefix}`;
  }

	return {
		verbose: debug(`${prefix}:verbose`),
		info: debug(`${prefix}:info`),
		warning: debug(`${prefix}:warning`),
		error: debug(`${prefix}:error`),

		child: (fn: LogPrefix) => _createLogger(fn, prefix),
	}
}

export function createLogger(logPrefix: LogPrefix) {
	return _createLogger(logPrefix)
}

export function getNodePos(node: Node) {
	return `${node
		.getSourceFile()
		.getFilePath()}:${node.getStartLineNumber()}:${node.getStartLinePos()}`
}
