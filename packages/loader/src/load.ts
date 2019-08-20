// @ts-ignore
// import _requirejs from 'requirejs'
import { PluginPool } from '@plugin-pool/core'
import { Config } from './interfaces/config'
import { IPlugin } from '@plugin-pool/core/dist/interfaces/Plugin'

// @ts-ignore
import _loader from 'steal'

const _loadModule = (path: string) => _loader.import(path)

const load = async (config: Config) => {
	const ps = config.pluginPaths.map(p => _loadModule(p))
	const plugins = await Promise.all(ps)
	// TODO: verify plugins content
	const pool = new PluginPool()
	pool.importPlugins(plugins as IPlugin[])
	return pool
}

export default load
