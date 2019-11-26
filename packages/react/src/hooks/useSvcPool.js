import { useContext, Context } from 'react'
import { ServicePool } from '@svc-pool/core'
import { SvcPoolContext } from '../components/Context'

export const createUseSvcPool = (context = SvcPoolContext) => {
	return () => useContext(context)
}

export const useSvcPool = createUseSvcPool()
