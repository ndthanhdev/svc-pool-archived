import React from 'react'
import { createPluginPool } from 'plugin-pool'
import { mount } from 'enzyme'
import { usePluginPool, Provider } from '../../src'
import { HookWrapper } from '../utils'

test('usePluginPool', () => {
  let actual = null
  const runner = () => {
    actual = usePluginPool()
  }

  const pool = createPluginPool()
  mount(
    <Provider value={pool}>
      <HookWrapper callback={runner} />
    </Provider>,
  )

  expect(actual).toBe(pool)
})
