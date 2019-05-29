import { useContext } from 'react'
import { SvcPoolContext } from '../components/Context'

export const useSvcPool = () => {
	return useContext(SvcPoolContext)
}
