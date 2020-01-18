import Registry from '../registry'
import { Overwrite } from 'utility-types'
import { PointNames, ValueTypeOfSvc } from './util-types'

// Define service
type FullDepsDef = Partial<Record<PointNames, boolean>>

type FactoryArg1 = Partial<Registry>

export type FullSvcDef<T extends PointNames> = {
	point: T
	desc: string
	deps: FullDepsDef
	factory: (
		deps?: FactoryArg1,
	) => Promise<ValueTypeOfSvc<T>> | ValueTypeOfSvc<T>
}

type Deps = PointNames[] | FullDepsDef

type CreateSvcDefArg1<T extends PointNames> = Overwrite<
	FullSvcDef<T>,
	{
		desc?: string
		deps?: Deps
	}
>

// createServiceDefinition
export const createSvcDef: <T extends PointNames>(
	arg: CreateSvcDefArg1<T>,
) => FullSvcDef<T>
