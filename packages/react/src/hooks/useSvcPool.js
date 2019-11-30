import { useContext } from 'react'
import { SvcPoolContext } from '../components/Context'

export const createUseSvcPool = (context = SvcPoolContext) => () =>
	useContext(context)

export const useSvcPool = createUseSvcPool()
