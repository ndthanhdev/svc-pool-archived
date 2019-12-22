import 'typescript'
import path from 'path'
import { extractFiles, extractConfig, extractOptions } from './utils/files'
import { visitDeclarations } from './utils/walkers'
import * as ts from 'typescript'

// console.log(require('./tsconfig.json'))

// console.log(extractOptions(extractConfig('../generator-sample-proj')))

extractFiles('../generator-sample-proj').then(files => {
	if (!files) {
		return
	}

	console.log(
		extractOptions(extractConfig(path.resolve('../generator-sample-proj'))),
	)

	console.log(path.resolve('../generator-sample-proj'))

	extractConfig(path.resolve('../generator-sample-proj')).then(config => {
		console.log(config)

		ts.createProgram(files, config)
			.getSourceFiles()
			.map(visitDeclarations)
	})
})
