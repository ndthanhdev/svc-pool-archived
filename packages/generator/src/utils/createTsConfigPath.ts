import { ts } from 'ts-morph'
import { pipe, then } from 'ramda'
import { resolve } from 'path'
import isDir from './isDir'

function handleDir(dir: string) {
	const configPath = ts.findConfigFile(dir, ts.sys.fileExists)

	return configPath
}

export function createTsConfigPath(tsConfigFilePathOrProject: string) {
	const absPth = resolve(tsConfigFilePathOrProject)

	return pipe(
		() => absPth,
		isDir,
		then(isDir => {
			if (isDir) {
				return handleDir(absPth)
			}
			return absPth
		}),
	)()
}
