import {
	createDefinitionPool,
	IPluginDefinition,
	DefinitionPool,
} from '@plugin-pool/core'
// @ts-ignore
import requirejs from 'requirejs'

export interface Config {
	// path to plugin
	pluginPaths: string[]
}

export type Loader = {
	load(config: Config): Promise<DefinitionPool>
}

function createLoader(): Loader {
	const _loadAMD = requirejs

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
