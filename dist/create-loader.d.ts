import { FullSvcDef, PointNames } from '@svc-pool/core';
export declare type Loader = {
    loadSvcDef(pluginPath: string): Promise<FullSvcDef<PointNames>[]>;
    loadSvcDefs(pluginPaths: string[]): Promise<FullSvcDef<PointNames>[]>[];
};
export declare type DynamicImport = {
    (path: string): Promise<any>;
};
export declare function createAMDImport(): DynamicImport;
export declare function createESImport(): DynamicImport;
export declare function createLoader(dynamicImport?: DynamicImport): Loader;
//# sourceMappingURL=create-loader.d.ts.map