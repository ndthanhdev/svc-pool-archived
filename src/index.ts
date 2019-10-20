import { IPluginDefinition } from './interfaces'
import { IServiceDefinition } from './interfaces/ServiceDefinition'
import { Point } from './interfaces/Point'

export { createDefinitionPool, PluginPool } from './createDefinitionPool'

export const createPlugin = (definitions: IServiceDefinition[]): IPluginDefinition => [
	...definitions,
]

export { Point }
export * from './interfaces'
