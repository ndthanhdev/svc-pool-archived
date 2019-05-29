import { FullSvcDef } from '@svc-pool/core'
import { PointNames } from '@svc-pool/registry'
import { isAMD, isES } from './env-utils'

export type Loader = {
	loadSvcDef(pluginPath: string): Promise<FullSvcDef<PointNames>[]>
	loadSvcDefs(pluginPaths: string[]): Promise<FullSvcDef<PointNames>[]>[]
}

export type DynamicImport = {
	(path: string): Promise<any>
}

function _createAMDImport() {
	const _window = window as any
	const _require = _window.requirejs || _window.require

	const _import = (path: string) =>
		new Promise((resolve, reject) => _require([path], resolve, reject))

	return _import
}

export function createAMDImport(): DynamicImport {
	if (!isAMD()) throw 'Not in AMD environment'

	return _createAMDImport()
}

function _createESImport() {
	const _import = (path: string) => import(path).then(m => m.default)

	return _import
}

export function createESImport(): DynamicImport {
	if (!isES()) throw 'Not in ES environment'

	return _createESImport()
}

function createDynamicImport() {
	if (isES()) {
		return _createESImport()
	}
	if (isAMD()) {
		return _createAMDImport()
	}
	throw 'Not in ES or AMD environment'
}

export function createLoader(dynamicImport?: DynamicImport): Loader {
	const _dynamicImport = dynamicImport || createDynamicImport()

	const loadSvcDef = async (pluginPath: string) => {
		return <Promise<FullSvcDef<PointNames>[]>>_dynamicImport(pluginPath)
	}

	const loadSvcDefs = (pluginPaths: string[]) => pluginPaths.map(loadSvcDef)

	return {
		loadSvcDef,
		loadSvcDefs,
	}
}
