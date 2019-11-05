import {
	createDefinitionPool,
	IPluginDefinition,
	DefinitionPool,
} from '@plugin-pool/core'

export interface Config {
	// path to plugin
	pluginPaths: string[]
}

export type Loader = {
	load(config: Config): Promise<DefinitionPool>
}

export type DynamicImport = {
	(path: string): Promise<any>
}

function isAMD() {
	const _window = window as any
	const _require = _window.requirejs || _window.require

	return (
		typeof _require === 'function' &&
		typeof _window.define === 'function' &&
		!!_window.define.amd
	)
}

function isES() {
	return 'noModule' in HTMLScriptElement.prototype
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
	const _import = (path: string) => import(path)

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

function createLoader(dynamicImport?: DynamicImport): Loader {
	const _dynamicImport = dynamicImport || createDynamicImport()

	const load = async (config: Config) => {
		const ps = config.pluginPaths.map(_dynamicImport)
		const plugins = await Promise.all(ps)
		// TODO: verify plugins content
		return createDefinitionPool().importPlugins(plugins as IPluginDefinition[])
	}

	return {
		load,
	}
}

export default createLoader
