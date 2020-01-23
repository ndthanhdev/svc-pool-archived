import React from 'react'
import { SvcPoolContext } from './Context'

export const SvcPoolContextProvider = ({
	value,
	context = SvcPoolContext,
	children,
}) => {
	const Context = context

	return <Context.Provider value={value}>{children}</Context.Provider>
}
