import { ValuesType } from 'utility-types'

// Leverage typescript declaration merging to enrich typescript type system
// usage:
// declare module '@plugin-pool/registry' {
//   export default interface {
//     <point-name>: <resolve-type>[]
//   }
// }

export default interface Schema {
	// example
	a: string[]
	b: number[]
}

export type PointNames = keyof Schema

type ValueTypeOfSvc<T extends PointNames> = ValuesType<
	ValuesType<Pick<Schema, T>>
>

// Define service
type Deps = ArrayLike<PointNames>

type Dep = Partial<Schema>

type FullServiceDefinition<T extends PointNames> = {
	name: T
	desc: string
	deps: Deps
	factory: (dep?: Dep) => Promise<ValueTypeOfSvc<T>> | ValueTypeOfSvc<T>
}

type CreateSvcDefArg<T extends PointNames> = Pick<
	FullServiceDefinition<T>,
	'name' | 'factory'
> &
	Partial<FullServiceDefinition<T>>

export interface CreateSvcDefFn {
	<T extends PointNames>(arg: CreateSvcDefArg<T>): FullServiceDefinition<T>
}

// Get services of point
export interface GetSvcsFn {
	<T extends PointNames>(name: T): ValueTypeOfSvc<T>
}
