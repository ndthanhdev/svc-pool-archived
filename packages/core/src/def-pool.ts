import { default as R } from 'ramda'
import {
	default as Schema,
	PointNames,
	ValueTypeOfSvc,
} from '@plugin-pool/registry'
import { FullSvcDef } from './service-definition'
import { Plugin } from './plugin'

type DefPool = Partial<Record<PointNames, FullSvcDef<PointNames>[]>>

export function createDefPool(): DefPool {
	return {}
}

export function registerSvcDef<T extends PointNames>(
	defPool: DefPool,
	svcDef: FullSvcDef<T>,
) {
	const next = { ...defPool }

	if (!R.isNil(next[svcDef.name])) {
		next[svcDef.name] = [...(next[svcDef.name] as []), svcDef]
	} else {
		next[svcDef.name] = [svcDef]
	}

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

export function resolveDefPool(defPool: DefPool) {
	const resolved: Partial<Schema> = {}
	const resolving = new Set<PointNames>()

	
}
