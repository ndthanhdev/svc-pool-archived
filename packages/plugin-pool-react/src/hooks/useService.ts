import { Point } from 'plugin-pool'
import usePluginPool from './usePluginPool'

export const useService = (point: Point | string) => {
  const context = usePluginPool()
  return context && context.getService(point)
}

export default useService
