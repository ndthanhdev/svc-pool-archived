import { resolve } from 'path'
import { Project } from 'ts-morph'
import { pipe } from 'ramda'

export function prepareSourceProject(
	tsConfigFilePathOrProject: string | Project,
) {
	if (typeof tsConfigFilePathOrProject === 'string') {
		return pipe(
			() => resolve(tsConfigFilePathOrProject),
			tsConfigFilePath =>
				new Project({
					tsConfigFilePath,
				}),
		)()
	}

	return tsConfigFilePathOrProject
}
