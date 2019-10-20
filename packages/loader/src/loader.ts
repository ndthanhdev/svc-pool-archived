import { createDefinitionPool, IPluginDefinition } from '@plugin-pool/core'

export interface Config {
	// path to plugin
	pluginPaths: string[]
}

const _window = window as any
const _loadAMD = _window.requirejs || _window.require

const _loadModule = (path: string) =>
	new Promise(resolve => _loadAMD([path], resolve))

const load = async (config: Config) => {
	const ps = config.pluginPaths.map(p => _loadModule(p))
	const plugins = await Promise.all(ps)
	// TODO: verify plugins content
	return createDefinitionPool().importPlugins(plugins as IPluginDefinition[])
}

export default {
	load,
}
