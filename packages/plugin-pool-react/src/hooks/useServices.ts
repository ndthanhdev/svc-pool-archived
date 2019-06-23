import { Point } from 'plugin-pool'
import usePluginPool from './usePluginPool'

export const useServices = (point: Point | string) => {
  const context = usePluginPool()
  return context && context.getServices(point)
}

export default useServices
