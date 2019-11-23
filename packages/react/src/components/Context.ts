import React from 'react'
import { ServicePool } from '@svc-pool/core'

export type SvcPoolContextType = ServicePool | undefined

export const SvcPoolContext = React.createContext<SvcPoolContextType>(undefined)

export default SvcPoolContext
