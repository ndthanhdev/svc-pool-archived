import path from 'path'
import {
	ts,
	Project,
	createWrappedNode,
	CompilerNodeToWrappedType,
} from 'ts-morph'
import { pipe, when } from 'ramda'
import { isRegistryDeclaration, RegistryDeclaration } from './utils/guards'
import { emit } from './utils/emitter'
import { prepareSourceProject } from './utils/loader'

// console.log(require('./tsconfig.json'))

// console.log(extractOptions(extractConfig('../generator-sample-proj')))

// extractFiles('../generator-sample-proj').then(files => {
// 	if (!files) {
// 		return
// 	}

// 	console.log(
// 		extractOptions(extractConfig(path.resolve('../generator-sample-proj'))),
// 	)

// 	console.log(path.resolve('../generator-sample-proj'))

// 	extractConfig(path.resolve('../generator-sample-proj')).then(config => {
// 		console.log(config)

// 		ts.createProgram(files, config)
// 			.getSourceFiles()
// 			.map(visitDeclarations)
// 	})
// })

pipe(
	() => prepareSourceProject('../generator-sample-proj/tsconfig.json'),
	proj => emit(proj, path.resolve('../generator-sample-proj/dist')),

	// const compilerNode = dcl.compilerNode
	// if(!ts.isModuleDeclaration(compilerNode)){
	// 	return
	// }

	// console.log(createWrappedNode(compilerNode).findReferencesAsNodes())
)()
