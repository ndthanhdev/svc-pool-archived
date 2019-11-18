import * as R from 'ramda'
import { default as Schema } from '@plugin-pool/registry'
import { CircularDependency } from './exceptions/Circular'
import { NotRegistered } from './exceptions/NotRegistered'
import { convertToFullDefinition } from './utils'
import {
	PoolDefinition,
	IFullDependencyDefinition,
	IFullServiceDefinition,
	IServiceDefinition,
	IPluginDefinition,
	Point,
} from './interfaces'
import { PointNames } from './service-definition'

const register = R.curry(
	(
		definitions: Map<PointNames, IFullServiceDefinition[]>,
		definition: IServiceDefinition,
	) => {
		const fullDefinition = convertToFullDefinition(definition)

		const inStock = (definitions.get(definition.point) ||
			[]) as IFullServiceDefinition[]
		definitions.set(definition.point, [...inStock, fullDefinition])

		return definitions
	},
)

const importPlugin = R.reduce<IServiceDefinition, PoolDefinition>(register)
const curriedImportPlugin = R.curry(
	(definitions: PoolDefinition, plugin: IPluginDefinition) =>
		importPlugin(definitions, plugin),
)

const importPlugins = R.reduce<IPluginDefinition, PoolDefinition>(
	curriedImportPlugin,
)
const curriedImportPlugins = R.curry(
	(definitions: PoolDefinition, plugins: IPluginDefinition[]) =>
		importPlugins(definitions, plugins),
)

const getServices = (resolved: Schema, point: PointNames) =>
	(resolved as Schema)[point]
const curriedGetServices = R.curry(getServices)

const resolve = (definition: PoolDefinition) => async (): Promise<
	PluginPool
> => {
	// @ts-ignore
	const resolved: ServiceResolutionTypes = {}
	const resolving = new Set()

	// recursive resolve point
	const resolvePoint = async (point: Point, root = false) => {
		const resolveDef = async (def: IFullDependencyDefinition) => {
			const theDefinitions = definition.get(def.point)

			if (!theDefinitions) {
				if (def.optional) {
					return undefined
				}
				throw new NotRegistered(point)
			} else {
				return await resolvePoint(def.point)
			}
		}

		const resolveServices = async (definitions: IFullServiceDefinition[]) => {
			const resolveService = async (definition: IFullServiceDefinition) => {
				const deps = definition.deps
				const resolvedDeps: any = {}

				for (const key in deps) {
					const registeredPoint = deps[key]
					resolvedDeps[key] = await resolveDef(registeredPoint)
				}

				const instance = await definition.factory(resolvedDeps)

				return instance
			}

			const instances = []

			for (const def of definitions) {
				instances.push(await resolveService(def))
			}

			return instances
		}

		// if there is already a service for this point maybe this is a many point
		// @ts-ignore
		if (resolved[point] && !root) {
			// @ts-ignore
			return resolved[point]
		}

		// if currently resolving the same type, we have a circular dependency
		if (resolving.has(point)) {
			throw new CircularDependency(point)
		}

		resolving.add(point)

		const definitions = definition.get(point) as IFullServiceDefinition[]

		const instances = await resolveServices(definitions)

		resolving.delete(point)

		return instances
	}

	// resolve points serially
	const points = Array.from(definition.keys())
	for (const point of points) {
		const instances = (await resolvePoint(point, true)) as any[]
		// @ts-ignore
		resolved[point] = instances
	}

	return {
		getServices: curriedGetServices(resolved),
	}
}

export type PluginPool = {
	getServices: GetSvcsFn
}

export type DefinitionPool = {
	register: (arg1: IServiceDefinition) => DefinitionPool
	importPlugin: (arg1: IPluginDefinition) => DefinitionPool
	importPlugins: (arg1: IPluginDefinition[]) => DefinitionPool
	resolve: () => Promise<PluginPool>
}

export const createDefinitionPool = (
	serviceDefinitions: PoolDefinition = new Map<
		Point,
		IFullServiceDefinition[]
	>(),
): DefinitionPool => {
	const next = R.clone(serviceDefinitions)

	const theRegister = R.pipe<
		IServiceDefinition,
		PoolDefinition,
		DefinitionPool
	>(
		register(next),
		createDefinitionPool,
	)

	const theImportPlugin = R.pipe<
		IPluginDefinition,
		PoolDefinition,
		DefinitionPool
	>(
		curriedImportPlugin(next),
		createDefinitionPool,
	)

	const theImportPlugins = R.pipe<
		IPluginDefinition[],
		PoolDefinition,
		DefinitionPool
	>(
		curriedImportPlugins(next),
		createDefinitionPool,
	)

	return {
		register: theRegister,
		importPlugin: theImportPlugin,
		importPlugins: theImportPlugins,
		resolve: resolve(next),
	}
}
