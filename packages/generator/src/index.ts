import { pipe, then } from 'ramda'
import { emitRegistries, EmitRegistriesOptions } from './utils/emitters'
import { createSourceProject } from './utils/createSourceProject'
import filterNonRegistryFiles from './utils/filterNonRegistryFiles'

export const listRegistryFiles = (
	tsconfigPathOrProject: Parameters<typeof createSourceProject>[number],
) =>
	pipe(
		createSourceProject,
		then(srcProj => srcProj.getSourceFiles()),
		then(filterNonRegistryFiles),
	)(tsconfigPathOrProject)

type GenerateSrcOptions = Omit<
	EmitRegistriesOptions,
	'compilerOptions' | 'registryFiles'
> & {
	tsconfigPathOrProject: Parameters<typeof createSourceProject>[number]
}

export const generateSrc = (options: GenerateSrcOptions) => {
	const { tsconfigPathOrProject } = options

	return pipe(
		createSourceProject,
		then(srcProj => ({
			srcProj,
			registryFiles: srcProj.getSourceFiles(),
		})),
		then(({ registryFiles, ...other }) => ({
			...other,
			registryFiles: filterNonRegistryFiles(registryFiles),
		})),
		then(({ srcProj, registryFiles }) =>
			emitRegistries({
				compilerOptions: srcProj.compilerOptions,
				registryFiles,
				...options,
			}),
		),
	)(tsconfigPathOrProject)
}
