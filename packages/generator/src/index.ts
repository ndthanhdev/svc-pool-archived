import { pipe, then } from 'ramda'
import emit from './utils/emit'
import { prepareSourceProject } from './utils/prepareSourceProject'
import filterNonRegistryFiles from './utils/filterNonRegistryFiles'

export const listRegistryFiles = (
	tsconfigPathOrProject: Parameters<typeof prepareSourceProject>[number],
) =>
	pipe(
		prepareSourceProject,
		then(srcProj => srcProj.getSourceFiles()),
		then(filterNonRegistryFiles),
	)(tsconfigPathOrProject)

export const generate = (
	tsconfigPathOrProject: Parameters<typeof prepareSourceProject>[number],
	outDir: string,
) =>
	pipe(
		prepareSourceProject,
		then(srcProj => ({
			srcProj,
			sourceFiles: srcProj.getSourceFiles(),
		})),
		then(({ sourceFiles, ...other }) => ({
			...other,
			sourceFiles: filterNonRegistryFiles(sourceFiles),
		})),
		then(({ srcProj, sourceFiles }) =>
			emit(srcProj.compilerOptions, sourceFiles, outDir),
		),
	)(tsconfigPathOrProject)
