import { useContext, useMemo } from 'react'
import { useSvcPool as useDefaultSvcPool } from './useSvcPool'
import { SvcPoolContext } from '../components/Context'

export function createUseServices(context = SvcPoolContext) {
	const useSvcPool =
		context === SvcPoolContext ? useDefaultSvcPool : () => useContext(context)

	const useServices = point => {
		const svcPool = useSvcPool()

		return useMemo(() => svcPool && svcPool.getServices(point), [
			svcPool,
			point,
		])
	}

	return useServices
}

export const useServices = createUseServices()
