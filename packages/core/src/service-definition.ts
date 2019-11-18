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

export type FullSvcDef<T extends PointNames> = {
	name: T
	desc: string
	deps: FullDepsDef
	factory: (deps?: FactoryArg1) => Promise<ValueTypeOfSvc<T>> | ValueTypeOfSvc<T>
}

type Deps = PointNames[] | FullDepsDef

type CreateSvcDefArg1<T extends PointNames> = Overwrite<
	FullSvcDef<T>,
	{
		desc?: string
		deps?: Deps
	}
>

interface CreateSvcDefFn {
	<T extends PointNames>(arg: CreateSvcDefArg1<T>): FullSvcDef<T>
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
