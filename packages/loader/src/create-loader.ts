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

type AMDRequire = {
	(deps: string[], cb: (deps: any[]) => any): void
}

function createLoader(require?: AMDRequire): Loader {
	const _window = window as any
	const _loadAMD = require || _window.requirejs || _window.require

	const _loadModule = (path: string) =>
		new Promise(resolve => _loadAMD([path], resolve))

	const load = async (config: Config) => {
		const ps = config.pluginPaths.map(p => _loadModule(p))
		const plugins = await Promise.all(ps)
		// TODO: verify plugins content
		return createDefinitionPool().importPlugins(plugins as IPluginDefinition[])
	}

	return {
		load,
	}
}

export default createLoader
