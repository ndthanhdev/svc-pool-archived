import React from 'react'
import { createPluginPool, createPlugin } from 'plugin-pool'
import { mount } from 'enzyme'
import { usePluginPool, Provider, useServices } from '../src'
import { HookWrapper } from './utils'

declare module 'plugin-pool' {
  export interface ServiceResolutionTypes {
    'test-point': any[]
  }
}

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

test('useServices', async () => {
  const pool = createPluginPool()
  const testPoint = 'test-point'

  const pluginOfManyPoint = createPlugin([
    { point: testPoint, factory: () => 'service1' },
    { point: testPoint, factory: () => 'service2' },
  ])

  pool.importPlugin(pluginOfManyPoint)

  await pool.resolve()

  let actual
  const runner = () => {
    actual = useServices('test-point')
  }

  mount(
    <Provider value={pool}>
      <HookWrapper callback={runner} />
    </Provider>,
  )
  console.log(actual)

  expect(actual).toStrictEqual(['service1', 'service2'])

  expect(true).toBe(true)
})
