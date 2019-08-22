import {
	PluginPool,
	IPlugin,
} from '../node_modules/@plugin-pool/core/src/index'
import { Config } from './interfaces/config'

const _window = window as any
const _loadAMD = _window.requirejs || _window.require

const _loadModule = (path: string) =>
	new Promise(resolve => _loadAMD([path], resolve))

const load = async (config: Config) => {
	const ps = config.pluginPaths.map(p => _loadModule(p))
	const plugins = await Promise.all(ps)
	// TODO: verify plugins content
	const pool = new PluginPool()
	pool.importPlugins(plugins as IPlugin[])
	return pool
}

export default {
	load,
}
