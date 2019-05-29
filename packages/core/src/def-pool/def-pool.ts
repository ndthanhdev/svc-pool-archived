import {
	Schema,
	PointNames,
	ValueTypeOfSvc,
} from '@svc-pool/registry'
import { FullSvcDef } from '../service-definition'
import { NotRegistered, CircularDependency } from './exceptions'

type DefPool = FullSvcDef<PointNames>[]

export function createDefPool(): DefPool {
	return []
}

export function registerSvcDef<T extends PointNames>(
	defPool: DefPool,
	svcDef: FullSvcDef<T>,
) {
	const next = [...defPool, svcDef]

	return next
}

export function registerSvcDefs(
	defPool: DefPool,
	svcs: FullSvcDef<PointNames>[],
) {
	const init = [...defPool]
	return svcs.reduce((acc, cur) => registerSvcDef(acc, cur), init)
}

type Table = Partial<Record<PointNames, FullSvcDef<PointNames>[]>>

function createTable(defPool: DefPool): Table {
	const r: Table = {}

	function appendOrCreate(t: Table, def: FullSvcDef<PointNames>) {
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

function extractPoints(t: Table) {
	return Object.keys(t)
}

type GetSvcsFn = {
	<T extends PointNames>(name: T): Schema[T]
}

export type ServicePool = {
	getServices: GetSvcsFn
}

function createSvcPool(resolved: Partial<Schema>): ServicePool {
	// @ts-ignore
	const r: Schema = { ...resolved }

	// @ts-ignore
	const getServices: GetSvcsFn = name => {
		const svcs = r[name]
		if (svcs) {
			return [...svcs]
		}
		return undefined
	}

	return { getServices }
}

export async function resolveDefPool(defPool: DefPool) {
	const table = createTable(defPool)
	const points = extractPoints(table)
	const resolved: Partial<Schema> = {}
	const resolving = new Set<PointNames>()

	async function resolveDep<T extends PointNames>(dep: T, isRequired: boolean) {
		const def = table[dep]

		if (!def) {
			if (isRequired) {
				throw new NotRegistered(dep)
			}

			return undefined
		}

		return await resolvePoint(dep)
	}

	async function resolveSvc(def: FullSvcDef<PointNames>) {
		const deps: Partial<Schema> = {}

		for (const key in def.deps) {
			// @ts-ignore
			deps[key as PointNames] = await resolveDep(
				key as PointNames,
				!!def.deps[key as PointNames],
			)
		}

		const instance = await def.factory(deps)

		return instance
	}

	async function resolveSvcs(defs: FullSvcDef<PointNames>[]) {
		return await Promise.all(defs.map(resolveSvc))
	}

	async function resolvePoint(point: PointNames, isRoot: boolean = false) {
		// if there is already a service for this point maybe this is a many point
		if (resolved[point] && !isRoot) {
			return resolved[point]
		}

		// if currently resolving the same type, we have a circular dependency
		if (resolving.has(point)) {
			throw new CircularDependency(point)
		}

		resolving.add(point)

		const defs = table[point] as FullSvcDef<PointNames>[]

		const instances = await resolveSvcs(defs)

		resolving.delete(point)

		return instances
	}

	for (const p of points) {
		// @ts-ignore
		resolved[p] = await resolvePoint(p as PointNames, true)
	}

	return createSvcPool(resolved)
}
