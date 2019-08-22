import PluginPool from './PluginPool'
import { IServiceDefinition } from './interfaces/ServiceDefinition'
import { IPlugin } from './interfaces'
import { Point } from './Point'

export const createPluginPool = () => new PluginPool()

export const createPlugin = (definitions: IServiceDefinition[]): IPlugin => [
	...definitions,
]

export { PluginPool, Point }
export * from './interfaces'
