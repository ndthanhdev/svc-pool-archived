import React from 'react'
import { ServicePool } from '@svc-pool/core'

export const useSvcPool: () => ServicePool

export const createUseSvcPool: (
	context: React.Context<ServicePool>,
) => typeof useSvcPool
