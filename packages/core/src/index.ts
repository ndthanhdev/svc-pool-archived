import { IPluginDefinition } from './interfaces'
import { IServiceDefinition } from './interfaces/ServiceDefinition'
import { Point } from './interfaces/Point'

export { createDefinitionPool, PluginPool, DefinitionPool } from './d-def-pool'

export const createPlugin = (definitions: IServiceDefinition[]): IPluginDefinition => [
	...definitions,
]

export { Point }
export * from './interfaces'
