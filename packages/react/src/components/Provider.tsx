import React from 'react'
import { SvcPoolContext, SvcPoolContextType } from './Context'
import { ServicePool } from '@svc-pool/core'

interface IPluginPoolContextProvider {
	value: ServicePool
	context?: React.Context<SvcPoolContextType>
}

export const PluginPoolContextProvider: React.FC<
	IPluginPoolContextProvider
> = ({ value, context, children }) => {
	const Context = context || SvcPoolContext

	return <Context.Provider value={value}>{children}</Context.Provider>
}

export default PluginPoolContextProvider
