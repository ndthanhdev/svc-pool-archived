import { pipe, then } from 'ramda'
import * as ts from "typescript";
import * as tsConfig from "tsconfig";
import path from 'path'
import createLog from "debug";

export const extractConfig = (cwd:string = process.cwd()) => tsConfig.load(cwd).then(result => result.config)

export const extractOptions = (config:any) => config.compilerOptions as ts.CompilerOptions

const defaultExcludes:string[] = []
export const extractExcludes = (config:any) => (config?.excludes || defaultExcludes) as string[]

const defaultIncludes = ['**/*']
export const extractIncludes = (config:any) => (config?.includes || defaultIncludes) as string[]


const defaultExtension = ['ts','tsx']

export const extractFiles = (rootDir = process.cwd(), extensions = defaultExtension) => {
	const log = createLog('extractFiles')
	
	return pipe(
	() => {
		const absoluteRootPath = path.resolve(rootDir)
		return extractConfig(absoluteRootPath)
		.then(config => ({
			config,
			absoluteRootPath,
		}))
	},
	then(pipe(
	({config, absoluteRootPath}:{config:any, absoluteRootPath:string}) => ( {
		absoluteRootPath,
		excludes: extractExcludes(config), 
		includes: extractIncludes(config), 
		host: ts.createCompilerHost(extractOptions(config)),
	}),
	({absoluteRootPath, excludes, includes, host}) => {
		if(host.readDirectory){
			log(`cwd: ${JSON.stringify(rootDir)}`)
			log(`extensions: ${JSON.stringify(extensions)}`)
			log(`excludes: ${JSON.stringify(excludes)}`)
			log(`includes: ${JSON.stringify(includes)}`)
			const r =  host.readDirectory(absoluteRootPath, extensions, excludes, includes)

			log(`return: ${r}`)
			return r
		}
	})))()
}






