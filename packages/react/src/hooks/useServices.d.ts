import React from 'react'
import { PointNames } from '@svc-pool/core'
import Registry from '@svc-pool/core/registry'

type useServicesHook = {
	<T extends PointNames>(point: T): Registry[T] | undefined
}

export declare function createUseServices(
	context?: React.Context<any>,
): useServicesHook

export declare const useServices: useServicesHook
