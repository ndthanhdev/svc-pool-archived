import React from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Callback = () => any

interface TestHookProps {
  callback: Callback
}

export const HookWrapper: React.FC<TestHookProps> = ({ callback }) => {
  callback()
  return null
}
