import { ValuesType } from 'utility-types'

// Leverage typescript declaration merging to enrich typescript type system
// usage:
// declare module '@svc-pool/registry' {
//   export interface {
//     <point-name>: <resolve-type>[]
//   }
// }

export interface Schema {
	// example
	a: string[]
	b: number[]
}

export type PointNames = keyof Schema

export type ValueTypeOfSvc<T extends PointNames> = ValuesType<
	ValuesType<Pick<Schema, T>>
>
