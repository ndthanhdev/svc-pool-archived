import { Project } from 'ts-morph'

export function prepareSourceProject(
	tsConfigFilePathOrProject: string | Project,
) {
	if (typeof tsConfigFilePathOrProject === 'string') {
		return new Project({
			tsConfigFilePath: tsConfigFilePathOrProject,
		})
	}

	return tsConfigFilePathOrProject
}
