import { PointNames } from '@svc-pool/core/registry'
import usePluginPool from './usePluginPool'

export const useServices = (point: PointNames) => {
	const context = usePluginPool()
	return context && context.getServices(point)
}

export default useServices
