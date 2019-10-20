import { PointNames, ServiceResolutionTypes } from '../registry';
import { IFullServiceDefinition, IServiceDefinition, IPluginDefinition } from './interfaces';
declare const getServices: (resolved: ServiceResolutionTypes, point: never) => never;
export declare type PluginPool = {
    getServices: (arg1: PointNames) => ReturnType<typeof getServices>;
};
export declare type DefinitionPool = {
    register: (arg1: IServiceDefinition) => DefinitionPool;
    importPlugin: (arg1: IPluginDefinition) => DefinitionPool;
    importPlugins: (arg1: IPluginDefinition[]) => DefinitionPool;
    resolve: () => Promise<PluginPool>;
};
export declare const createDefinitionPool: (serviceDefinitions?: Map<string, IFullServiceDefinition[]>) => DefinitionPool;
export {};
//# sourceMappingURL=createDefinitionPool.d.ts.map