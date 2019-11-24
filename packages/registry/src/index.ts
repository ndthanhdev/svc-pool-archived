import { ValuesType } from 'utility-types'

// Leverage typescript declaration merging to enrich typescript type system
// usage:
// declare module '@svc-pool/registry' {
//   export interface Schema {
//     <point-name>: <resolve-type>[]
//   }
// }

export interface Schema {
	// example
	'example-point': string[]
}

export type PointNames = keyof Schema

export type ValueTypeOfSvc<T extends PointNames> = ValuesType<
	ValuesType<Pick<Schema, T>>
>
