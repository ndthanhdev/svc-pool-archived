// Leverage typescript declaration merging to enrich typescript type system
// usage
// declare module '@plugin-pool/registry' {
//   export interface ServiceResolutionTypes {
//     <point-name>: <resolve-type>[]
//   }
// }
export interface ServiceResolutionTypes {}

export type PointNames = keyof ServiceResolutionTypes
