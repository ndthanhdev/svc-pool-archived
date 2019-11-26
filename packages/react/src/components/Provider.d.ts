import React from 'react'
import { SvcPoolContext } from './Context'
import { ServicePool } from '@svc-pool/core'

type Props = {
	value: ServicePool
	context?: React.Context<ServicePool>
}

export const SvcPoolContextProvider: React.FC<Props>
