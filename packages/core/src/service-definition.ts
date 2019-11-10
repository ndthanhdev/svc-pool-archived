import { default as Schema } from '@plugin-pool/registry'
import { ValuesType, Overwrite } from 'utility-types'
import R from 'ramda'

export type PointNames = keyof Schema

export type ValueTypeOfSvc<T extends PointNames> = ValuesType<
	ValuesType<Pick<Schema, T>>
>

// Define service
type FullDepsDef = Partial<Record<PointNames, boolean>>

type FactoryArg1 = Partial<Schema>

type FullServiceDefinition<T extends PointNames> = {
	name: T
	desc: string
	deps: FullDepsDef
	factory: (dep?: FactoryArg1) => Promise<ValueTypeOfSvc<T>> | ValueTypeOfSvc<T>
}

type Deps = PointNames[] | FullDepsDef

type CreateSvcDefArg1<T extends PointNames> = Overwrite<
	FullServiceDefinition<T>,
	{
		desc?: string
		deps?: Deps
	}
>

export interface CreateSvcDefFn {
	<T extends PointNames>(arg: CreateSvcDefArg1<T>): FullServiceDefinition<T>
}

// createServiceDefinition
export const createSvcDef: CreateSvcDefFn = ({
	desc = '',
	deps = {},
	...other
}) => {
	let theDeps: FullDepsDef = {}

	if (Array.isArray(deps)) {
		R.reduce(
			(prev, cur) => {
				prev[cur] = true
				return prev
			},
			theDeps,
			deps,
		)
	} else {
		theDeps = { ...deps }
	}

	return {
		...other,
		desc,
		deps: theDeps,
	}
}

export default createSvcDef
