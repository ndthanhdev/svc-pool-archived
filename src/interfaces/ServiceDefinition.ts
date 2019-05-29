import { Point } from "./Point";
import { IServiceFactory } from "./ServiceFactory";

export interface IDependenciesMap {
  [key: string]: Point
}

export interface IServiceDefinition {
  point: Point
  deps?: IDependenciesMap,
  factory: IServiceFactory
}

export interface IFullServiceDefinition {
  point: Point
  deps: IDependenciesMap,
  factory: IServiceFactory
}