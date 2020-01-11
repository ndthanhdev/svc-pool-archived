import { pipe } from 'ramda'
import emit from './utils/emit'
import { prepareSourceProject } from './utils/prepareSourceProject'
import filterNonRegistryFiles from './utils/filterNonRegistryFiles'

export const listRegistryFiles = (
	tsconfigPathOrProject: Parameters<typeof prepareSourceProject>[number],
) =>
	pipe(
		prepareSourceProject,
		srcProj => srcProj.getSourceFiles(),
		filterNonRegistryFiles,
	)(tsconfigPathOrProject)

export const generate = (
	tsconfigPathOrProject: Parameters<typeof prepareSourceProject>[number],
	outDir: string,
) =>
	pipe(
		prepareSourceProject,
		srcProj => ({
			srcProj,
			sourceFiles: srcProj.getSourceFiles(),
		}),
		({ sourceFiles, ...other }) => ({
			...other,
			sourceFiles: filterNonRegistryFiles(sourceFiles),
		}),
		({ srcProj, sourceFiles }) =>
			emit(srcProj.compilerOptions, sourceFiles, outDir),
	)(tsconfigPathOrProject)
