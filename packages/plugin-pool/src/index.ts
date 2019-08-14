import PluginPool from './PluginPool'
import { IServiceDefinition } from './interfaces/ServiceDefinition'
import { IPlugin } from './interfaces/Plugin'
import { Point } from './Point'
import { PointNames, ServiceResolutionTypes } from './registry'

export const createPluginPool = () => new PluginPool()

export const createPlugin = (definitions: IServiceDefinition[]): IPlugin => [
	...definitions,
]

export { PluginPool, Point, PointNames, ServiceResolutionTypes }
