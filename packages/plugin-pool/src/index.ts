import PluginPool from './PluginPool'
import { IServiceDefinition } from './interfaces/ServiceDefinition'
import { IPlugin } from './interfaces/Plugin'
import { Point } from './Point'

export const createPluginPool = () => new PluginPool()

export const createPlugin = (definitions: IServiceDefinition[]): IPlugin => [
  ...definitions,
]

export const createPoint = (name: string, many?: boolean): Point =>
  new Point(name, many)

export { PluginPool }
