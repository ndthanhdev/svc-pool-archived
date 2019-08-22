import React from 'react'
import Context from './Context'
import { PluginPool } from '@plugin-pool/core'

interface IPluginPoolContextProvider {
  value: PluginPool
}

export const PluginPoolContextProvider: React.FC<
  IPluginPoolContextProvider
> = ({ value, children }) => (
  <Context.Provider value={value}>
    {children}
  </Context.Provider>
)

export default PluginPoolContextProvider
