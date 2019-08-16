import {
	IDependencyDefinition,
	IFullDependencyDefinition,
	IServiceDefinition,
	IFullServiceDefinition,
	IFullDependenciesMap,
} from './interfaces/ServiceDefinition'

export function isFullDefinition(
	definition: IDependencyDefinition | IFullDependencyDefinition,
): definition is IFullDependencyDefinition {
	return (
		definition instanceof Object &&
		(definition as IFullDependencyDefinition).optional !== undefined
	)
}

export function convertToFullDefinition({
	deps = {},
	point,
	factory,
}: IServiceDefinition): IFullServiceDefinition {
	const re: IFullServiceDefinition = {
		point,
		factory,
		deps: {},
	}

	re.deps = Object.keys(deps).reduce(
		(acc, k) => {
			const depDef = deps[k]

			if (isFullDefinition(depDef)) {
				acc[k] = Object.assign({}, depDef)
			} else {
				acc[k] = {
					point: depDef,
					optional: false,
				}
			}

			return acc
		},
		{} as IFullDependenciesMap,
	)

	return re
}
