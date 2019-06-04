import { Point } from '../Point'
import { IServiceFactory } from './ServiceFactory'

export interface IFullDependencyDefinition {
  point: Point
  optional: boolean
}

export type IDependencyDefinition = IFullDependencyDefinition | Point

export interface IDependenciesMap {
  [key: string]: IDependencyDefinition
}

export interface IFullDependenciesMap {
  [key: string]: IFullDependencyDefinition
}

export interface IServiceDefinition {
  point: Point
  deps?: IDependenciesMap
  factory: IServiceFactory
}

export interface IFullServiceDefinition {
  point: Point
  deps: IFullDependenciesMap
  factory: IServiceFactory
}
