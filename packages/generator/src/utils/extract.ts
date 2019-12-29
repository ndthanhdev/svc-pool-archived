import {
	Project,
	createWrappedNode,
	CompilerOptions,
	ts,
	SourceFile,
	Node,
	CompilerNodeToWrappedType,
} from 'ts-morph'
import { isWrappedRegistryDeclaration, RegistryDeclaration } from './guards'
import { flatten, pipe, map, forEach } from 'ramda'
import debug from 'debug'
import { createFunctionLogger, getNodePos } from './log'

export function extract(proj: Project) {
	const logger = createFunctionLogger(extract)

	function collectDeclarations(sourceFile: SourceFile) {
		const log = logger.child(collectDeclarations)

		log.verbose(`begin ${sourceFile.getFilePath()}`)

		const r: CompilerNodeToWrappedType<RegistryDeclaration>[] = []

		sourceFile.forEachChild(mayBeDeclaration => {
			if (!isWrappedRegistryDeclaration(mayBeDeclaration)) {
				log.verbose(`filtered out: ${getNodePos(mayBeDeclaration)}`)
				return
			}

			log.verbose(`collected out: ${getNodePos(mayBeDeclaration)}`)
			r.push(mayBeDeclaration)

		})

		log.verbose(`finished ${sourceFile.getFilePath()}`)

		return r
	}

	function getRelativeNodes(
		declarations: CompilerNodeToWrappedType<RegistryDeclaration>[],
	) {
		const log = logger.child(getRelativeNodes)
		log.verbose(`begin ${declarations.length}`)

		const collection = new Set<Node>()

		const isFromExternal = (node: Node) =>
			!node.getSourceFile().isFromExternalLibrary()

		function handleDeclarationDep(node: Node) {
			if (!isFromExternal(node)) {
				log.verbose(`filtered out dep ${getNodePos(node)}`)
				return
			}
			log.verbose(`added dep ${getNodePos(node)}`)

			collection.add(node)
		}

		function handleDeclaration(
			dclNode: CompilerNodeToWrappedType<RegistryDeclaration>,
		) {
			collection.add(dclNode)
			log.verbose(`added ${getNodePos(dclNode)}`)

			pipe(
				() => dclNode.findReferencesAsNodes(),
				forEach(handleDeclarationDep),
			)()
		}

		declarations.forEach(handleDeclaration)

		const r = Array.from(collection)

		log.verbose(`finished ${r.length}`)

		return r
	}

	function writeOutput(nodes: Node[]) {
		const prunedProj = new Project({
			compilerOptions: { ...proj.compilerOptions },
			addFilesFromTsConfig: false,
			useInMemoryFileSystem: true,
		})
	}

	const declarations = pipe(
		() => proj.getSourceFiles(),
		map(collectDeclarations),
		flatten,
		getRelativeNodes,
		writeOutput,
	)()

	proj.getLanguageService()
}
