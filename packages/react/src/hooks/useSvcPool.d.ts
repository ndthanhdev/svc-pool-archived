import React from 'react'
import { ServicePool } from '@svc-pool/core'
import { SvcPoolContext } from '../components/Context'

export const useSvcPool: () => ServicePool

export const createUseSvcPool: (
	context: React.Context<ServicePool>,
) => typeof useSvcPool
