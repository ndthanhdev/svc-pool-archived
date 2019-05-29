import React from 'react'
import { SvcPoolContext, SvcPoolContextType } from './Context'
import { ServicePool } from '@svc-pool/core'

interface ISvcPoolContextProvider {
	value: ServicePool
	context?: React.Context<SvcPoolContextType>
}

export const SvcPoolContextProvider: React.FC<
	ISvcPoolContextProvider
> = ({ value, context, children }) => {
	const Context = context || SvcPoolContext

	return <Context.Provider value={value}>{children}</Context.Provider>
}
