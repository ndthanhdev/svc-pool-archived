import React, { useContext } from 'react'
import { PointNames } from '@svc-pool/registry'
import { useSvcPool as useDefaultSvcPool } from './useSvcPool'
import { SvcPoolContext } from '../components/Context'

export function createUseServices(context = SvcPoolContext) {
	const useSvcPool =
		context === SvcPoolContext ? useDefaultSvcPool : () => useContext(context)

	return function useServices<T extends PointNames>(point: T) {
		const svcPool = useSvcPool()
		return svcPool && svcPool.getServices(point)
	}
}

export const useServices = createUseServices()
