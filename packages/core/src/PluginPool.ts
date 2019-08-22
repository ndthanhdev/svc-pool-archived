import { IPlugin } from './interfaces/Plugin'
import { Point } from './Point'
import {
	IServiceDefinition,
	IFullServiceDefinition,
	IFullDependencyDefinition,
} from './interfaces/ServiceDefinition'
import { CircularDependency } from './exceptions/Circular'
import { NotRegistered } from './exceptions/NotRegistered'
import { Unresolved } from './exceptions/Unresolved'
import { ServiceResolutionTypes, PointNames } from '../registry'
import { convertToFullDefinition } from './utils'

export default class PluginPool {
	private registered = new Map<Point, IFullServiceDefinition[]>()
	private theGetServices: ((point: Point) => any[] | undefined) | null = null

	importPlugins(plugins: IPlugin[]) {
		plugins.forEach(plugin => this.importPlugin(plugin))
	}

	importPlugin(plugin: IPlugin) {
		plugin.forEach(definition => this.register(definition))
	}

	register(definition: IServiceDefinition) {
		const theDefinition = convertToFullDefinition(definition)
		const inStock = <IFullServiceDefinition[]>(
			(this.registered.get(definition.point) || [])
		)
		this.registered.set(definition.point, [...inStock, theDefinition])
	}

	async resolve() {
		// @ts-ignore
		const resolved: any = {}
		const resolving = new Set()

		// recursive resolve point
		const resolvePoint = async (point: Point, root = false) => {
			const resolveDef = async (def: IFullDependencyDefinition) => {
				const definitions = this.registered.get(def.point)

				if (!definitions) {
					if (def.optional) return undefined
					else throw new NotRegistered(point)
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

			const definitions = this.registered.get(point) as IFullServiceDefinition[]

			const instances = await resolveServices(definitions)

			resolving.delete(point)

			return instances
		}

		// resolve points serially
		const points = Array.from(this.registered.keys())
		for (const point of points) {
			const instances = (await resolvePoint(point, true)) as any[]
			// @ts-ignore
			resolved[point] = instances
		}

		// @ts-ignore
		this.theGetServices = (point: Point) =>
			// @ts-ignore
			<ServiceResolutionTypes>resolved[point]
	}

	getServices(point: PointNames) {
		if (!this.theGetServices) {
			throw new Unresolved()
		}

		return this.theGetServices(point)
	}

	// getService(point: PointNames) {
	//   const mayBeServices = this.getServices(point)
	//   return mayBeServices && mayBeServices[0]
	// }
}
