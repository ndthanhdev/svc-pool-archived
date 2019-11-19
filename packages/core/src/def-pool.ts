import { default as R } from 'ramda'
import {
	default as Schema,
	PointNames,
	ValueTypeOfSvc,
} from '@plugin-pool/registry'
import { FullSvcDef } from './service-definition'
import { Plugin } from './plugin'

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

export function importPlugin(defPool: DefPool, plugin: Plugin) {
	const init = { ...defPool }
	return plugin.reduce((acc, cur) => registerSvcDef(acc, cur), init)
}

export function importPlugins(defPool: DefPool, plugins: Plugin[]) {
	const init = { ...defPool }
	return plugins.reduce((acc, cur) => importPlugin(acc, cur), init)
}

type Table = Partial<Record<PointNames, FullSvcDef<PointNames>[]>>

function createTable(defPool: DefPool): Table {
	const r: Table = {}

	function appendOrCreate(t: Table, def: FullSvcDef<PointNames>) {
		const next = { ...t }

		const exist = next[def.name]
		if (exist) {
			next[def.name] = [...exist, { ...def }]
		} else {
			next[def.name] = [{ ...def }]
		}

		return next
	}

	return defPool.reduce((acc, cur) => appendOrCreate(acc, cur), r)
}

function extractPoints(t: Table) {
	return Object.keys(t)
}

export type GetSvcsFn = {
	<T extends PointNames>(name: T): ValueTypeOfSvc<T>
}

function createSvcPool(resolved: Partial<Schema>) {
	// @ts-ignore
	const r: Schema = { ...resolved }

	// @ts-ignore
	const getServices: GetSvcsFn = (name) => {
		const svcs= r[name]
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
				throw new Error(`Point requested was not registered yet: ${dep}`)
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
			throw new Error(`Cannot resolve circular dependencies: ${point}`)
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
