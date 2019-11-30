import { NotRegistered, CircularDependency } from './exceptions'

export function createDefPool() {
	return []
}

export function registerSvcDef(defPool, svcDef) {
	const next = [...defPool, svcDef]

	return next
}

export function registerSvcDefs(defPool, svcs) {
	const init = [...defPool]
	return svcs.reduce((acc, cur) => registerSvcDef(acc, cur), init)
}

function createTable(defPool) {
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

	return defPool.reduce((acc, cur) => appendOrCreate(acc, cur), r)
}

function extractPoints(t) {
	return Object.keys(t)
}

function createSvcPool(resolved) {
	const r = { ...resolved }

	const getServices = name => {
		const svcs = r[name]
		if (svcs) {
			return [...svcs]
		}
		return undefined
	}

	return { getServices }
}

export function resolveDefPool(defPool) {
	const table = createTable(defPool)
	const points = extractPoints(table)
	const resolved = {}
	const resolving = new Set()

	function resolveDep(dep, isRequired) {
		const def = table[dep]

		if (!def) {
			if (isRequired) {
				throw new NotRegistered(dep)
			}

			return undefined
		}

		return resolvePoint(dep) // eslint-disable-line no-use-before-define
	}

	function resolveSvc(def) {
		const deps = {}

		return Object.keys(def.deps)
			.reduce(
				(acc, key) =>
					acc
						.then(() => {
							return resolveDep(key, !!def.deps[key])
						})
						.then(dep => {
							deps[key] = dep
						}),
				Promise.resolve(),
			)
			.then(() => def.factory(deps))
	}

	function resolveSvcs(defs) {
		return Promise.all(defs.map(resolveSvc))
	}

	function resolvePoint(point, isRoot = false) {
		// if there is already a service for this point maybe this is a many point
		if (resolved[point] && !isRoot) {
			return resolved[point]
		}

		// if currently resolving the same type, we have a circular dependency
		if (resolving.has(point)) {
			throw new CircularDependency(point)
		}

		resolving.add(point)

		const defs = table[point]

		return resolveSvcs(defs).then(instances => {
			resolving.delete(point)

			return instances
		})
	}

	return points
		.reduce((acc, pointName) => {
			return acc
				.then(() => resolvePoint(pointName, true))
				.then(instances => {
					resolved[pointName] = instances
				})
		}, Promise.resolve())
		.then(() => createSvcPool(resolved))
}
