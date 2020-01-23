import Registry from '../../registry'
import { FullSvcDef } from '../service-definition'
import { PointNames } from '../util-types'

type DefPool = FullSvcDef<PointNames>[]

export declare function createDefPool(): DefPool

export declare function registerSvcDef<T extends PointNames>(
	defPool: DefPool,
	svcDef: FullSvcDef<T>,
): DefPool

export function registerSvcDefs(
	defPool: DefPool,
	svcs: FullSvcDef<PointNames>[],
): DefPool

type Table = Partial<Record<PointNames, FullSvcDef<PointNames>[]>>

export type ServicePool = {
	getServices: <T extends PointNames>(name: T) => Registry[T]
}

export declare function resolveDefPool(defPool: DefPool): Promise<ServicePool>
