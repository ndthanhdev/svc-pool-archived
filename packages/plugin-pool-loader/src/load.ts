// @ts-ignore
import _requirejs from 'requirejs'
import { PluginPool } from 'plugin-pool'
import { Config } from './interfaces/config'
import { IPlugin } from 'plugin-pool/dist/interfaces/Plugin'

const requirejs = _requirejs as Require

function _loadModule(path: string) {
  return new Promise<any>((resolve, reject) => {
    const handleSuccess = ([m]: Array<any>) => resolve(m)
    const handleError = (e: Error) => reject(e)

    requirejs([path], handleSuccess, handleError)
  })
}

async function load(config: Config) {
  const ps = config.pluginPaths.map(p => _loadModule(p))
  const plugins = await Promise.all(ps)
  // TODO: verify plugins content
  const pool = new PluginPool()
  pool.importPlugins(plugins as IPlugin[])
  return pool
}

export default load
