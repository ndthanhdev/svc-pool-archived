import {
	FullSvcDef,
	Registry,
	Point,
	ValueTypeOfSvc,
	SvcTable,
} from './svc-def'
import * as Exceptions from './exceptions'

export type ServicePool<R extends Registry> = {
	getServices: (name: Point<R>) => SvcTable<R>[typeof name]
}

function createTable<R extends Registry>(
	defs: FullSvcDef<R, Point<R>>[],
): {
	[key in Point<R>]: FullSvcDef<R, key>[]
} {
	const r = {}

	function appendOrCreate(t, def) {
		const next = { ...t }

		const exist = next[def.point]
		if (exist) {
			next[def.point] = [...exist, { ...def }]
		} else {
			next[def.point] = [{ ...def }]
		}

		return next
	}

	return defs.reduce((acc, cur) => appendOrCreate(acc, cur), r)
}

function createSvcPool<R extends Registry>(
	resolved: SvcTable<R>,
): ServicePool<R> {
	const r = { ...resolved }

	const getServices = (name: Point<R>): SvcTable<R>[typeof name] => {
		const svcs = r[name]
		if (svcs) {
			return [...svcs] as SvcTable<R>[typeof name]
		}
		return []
	}

	return { getServices }
}

export async function resolveDefs<R extends Registry = {}>(
	...defs: FullSvcDef<R, Point<R>>[]
): Promise<ServicePool<R>> {
	const table = createTable(defs)
	const points: Point<R>[] = Object.keys(table)

	const resolved: Partial<SvcTable<R>> = {}
	const resolving = new Set<Point<R>>()

	async function resolveDep<P extends Point<R>>(
		dep: P,
		isRequired: boolean,
	): Promise<SvcTable<R>[P]> {
		const def = table[dep]

		if (!def) {
			if (isRequired) {
				throw new Exceptions.NotRegistered(dep)
			}

			return undefined
		}

		return await resolvePoint(dep) // eslint-disable-line no-use-before-define
	}

	async function resolveSvc<P extends Point<R>>(
		def: FullSvcDef<R, P>,
	): Promise<ValueTypeOfSvc<R, P>> {
		const deps = {}

		const keys = Object.keys(def.deps ?? {})

		for (const k of keys) {
			deps[k] = await resolveDep(k, def.deps[k])
		}

		return await def.factory(deps)
	}

	function resolveSvcs<P extends Point<R>>(svcDefs: FullSvcDef<R, P>[]) {
		return Promise.all(svcDefs.map(resolveSvc))
	}

	async function resolvePoint<P extends Point<R>>(
		point: P,
		isRoot = false,
	): Promise<SvcTable<R>[P]> {
		// if there is already a service for this point maybe this is a many point
		if (resolved[point] && !isRoot) {
			return resolved[point]
		}

		// if currently resolving the same type, we have a circular dependency
		if (resolving.has(point)) {
			throw new Exceptions.CircularDependency(point)
		}

		resolving.add(point)

		const svcDefs = table[point]

		const instances = await resolveSvcs<P>(svcDefs)

		resolving.delete(point)

		return instances
	}

	for (const point of points) {
		resolved[point] = await resolvePoint(point, true)
	}

	return createSvcPool<R>(resolved as R)
}
