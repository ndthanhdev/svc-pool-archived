import React from 'react'
import { PointNames, ValueTypeOfSvc } from '@svc-pool/core'
import { SvcPoolContext } from '../components/Context'
import Registry from '@svc-pool/core/registry'

type useServicesHook = {
	<T extends PointNames>(point: T): Registry[T] | undefined
}

export declare function createUseServices(
	context?: React.Context<any>,
): useServicesHook

export declare const useServices: useServicesHook
