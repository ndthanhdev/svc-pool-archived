import { resolve } from 'path'
import { Project, ts } from 'ts-morph'
import { pipe, then } from 'ramda'
import isDir from './isDir'

export function prepareSourceProject(
	tsConfigFilePathOrProject: string | Project,
) {
	function handleDir(dir: string) {
		const configPath = ts.findConfigFile(dir, ts.sys.fileExists)

		return configPath
	}

	function createProj(tsConfigFilePath) {
		return new Project({
			tsConfigFilePath,
		})
	}

	if (typeof tsConfigFilePathOrProject === 'string') {
		const absPath = resolve(tsConfigFilePathOrProject)
		return pipe(
			isDir,
			then(isDir => {
				if (isDir) {
					return handleDir(absPath)
				}
				return absPath
			}),
			then(createProj),
		)(absPath)
	}

	return tsConfigFilePathOrProject
}
