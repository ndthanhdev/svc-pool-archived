import { Project, CompilerOptionsContainer } from 'ts-morph'
import { WrappedRegistryFile } from './guards'
import { pipe, then } from 'ramda'
import { createLogger } from './logger'
import path from 'path'
import jsonfile from 'jsonfile'

const logger = createLogger(emit)

export default function emit(
	compilerOptions: CompilerOptionsContainer,
	regFiles: WrappedRegistryFile[],
	outDir: string,
) {
	function createProjWithRegFiles() {
		const log = logger.child(createProjWithRegFiles)

		log.verbose('begin')

		const slimProj = new Project({
			compilerOptions: {
				...compilerOptions,
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
			return proj
		})
	}

	function emitConfig() {
		const log = logger.child(emitConfig)
		log.verbose(`emitting project configs`)

		const confPth = path.resolve(outDir, 'tsconfig.json')

		log.verbose(`emitting to ${confPth}`)

		const content = {
			compilerOptions: compilerOptions.get(),
		}

		log.verbose(`emitting content:`)
		log.verbose(content)

		return jsonfile
			.writeFile(confPth, content, {
				spaces: 4,
			})
			.then(r => {
				log.verbose(`wrote ${confPth}`)
				return r
			})
			.catch(err => {
				log.error('emitConfig failed. See error below:')
				log.error(err)
				throw err
			})
	}

	return pipe(
		createProjWithRegFiles,
		resolveDepFiles,
		emitProj,
		then(emitConfig),
	)()
}
