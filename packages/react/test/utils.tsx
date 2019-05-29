import React from 'react'

type Callback = () => any

interface ITestHookProps {
  callback: Callback
}

export const HookWrapper: React.FC<ITestHookProps> = ({ callback }) => {
  callback()
  return null
}
