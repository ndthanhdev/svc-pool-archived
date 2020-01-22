import { resolve } from 'path'
import _fs from 'fs'
import { Project, ts } from 'ts-morph'
import { pipe, then } from 'ramda'

const { stat } = _fs.promises

export function prepareSourceProject(
	tsConfigFilePathOrProject: string | Project,
) {
	function isDir(dir: string) {
		return stat(dir).then(stat => stat.isDirectory())
	}

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
