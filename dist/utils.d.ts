import { IDependencyDefinition, IFullDependencyDefinition, IFullServiceDefinition, IServiceDefinition } from './interfaces/ServiceDefinition';
export declare function isFullDefinition(definition: IDependencyDefinition | IFullDependencyDefinition): definition is IFullDependencyDefinition;
export declare function convertToFullDefinition({ deps, point, factory, }: IServiceDefinition): IFullServiceDefinition;
//# sourceMappingURL=utils.d.ts.map