import React from 'react'
import { PointNames, ValueTypeOfSvc } from '@svc-pool/core'
import { SvcPoolContext } from '../components/Context'

type useServicesHook = {
	<T extends PointNames>(point: T): ValueTypeOfSvc<T> | undefined
}

export declare function createUseServices(
	context: React.Context<any> = SvcPoolContext,
): useServicesHook

export declare const useServices: useServicesHook
