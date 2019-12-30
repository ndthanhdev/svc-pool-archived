import { Project, SourceFile } from 'ts-morph'
import { isWrappedRegistryFile, WrappedRegistryFile } from './guards'
import { pipe, filter } from 'ramda'
import { createFunctionLogger } from './log'

export function emit(sourceProj: Project, outDir: string) {
	const logger = createFunctionLogger(emit)

	function filterNonRegistryFiles(srcFiles: SourceFile[]) {
		const log = logger.child(filterNonRegistryFiles)

		return filter(srcFile => {
			const path = srcFile.getFilePath()
			if (!isWrappedRegistryFile(srcFile)) {
				log.verbose(`filtered out ${path}`)
				return false
			}
			log.verbose(`selected ${path}`)
			return true
		}, srcFiles)
	}

	function createProjWithRegFiles(regFiles: WrappedRegistryFile[]) {
		const log = logger.child(createProjWithRegFiles)

		log.verbose('begin')

		const slimProj = new Project({
			compilerOptions: {
				...sourceProj.compilerOptions,
				outDir,
				declaration: true,
				emitDeclarationOnly: true,
			},
			addFilesFromTsConfig: false,
		})

		function importFile(file: WrappedRegistryFile) {
			const path = file.getFilePath()

			slimProj.addSourceFileAtPath(path)

			log.verbose(`imported file: ${path}`)
		}

		regFiles.forEach(importFile)

		log.verbose('finished')

		return slimProj
	}

	function resolveDepFiles(proj: Project) {
		const log = logger.child(resolveDepFiles)

		log.verbose('begin')

		log.verbose(`resolving deps`)
		const addedFiles = proj.resolveSourceFileDependencies()

		addedFiles.forEach(file => {
			log.verbose(`imported dep: ${file.getFilePath()}`)
		})

		log.verbose('finished')

		return proj
	}

	function emitProj(proj: Project) {
		const log = logger.child(emitProj)
		log.verbose(`emitting ${proj.getSourceFiles().length} files`)

		return proj.emit().then(emitResult => {
			emitResult
				.getDiagnostics()
				.forEach(diagnostic => log.verbose(diagnostic.getMessageText()))
			log.verbose('emitted')
			return emitResult
		})
	}

	return pipe(
		() => sourceProj.getSourceFiles(),
		filterNonRegistryFiles,
		createProjWithRegFiles,
		resolveDepFiles,
		emitProj,
	)()
}
