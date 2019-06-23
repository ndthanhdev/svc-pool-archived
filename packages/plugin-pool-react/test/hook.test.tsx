import React from 'react'
import { createPluginPool, createPoint, createPlugin } from 'plugin-pool'
import { mount } from 'enzyme'
import { usePluginPool, Provider, useService, useServices } from '../src'
import { HookWrapper } from './utils'

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

test('useService', async () => {
  const pool = createPluginPool()
  const singlePoint = createPoint('singlePoint')
  const pluginOfSinglePoint = createPlugin([
    { point: singlePoint, factory: () => 'serviceOfSinglePoint' },
  ])

  pool.importPlugin(pluginOfSinglePoint)

  await pool.resolve()

  let actual
  const runner = () => {
    actual = useService(singlePoint)
  }

  mount(
    <Provider value={pool}>
      <HookWrapper callback={runner} />
    </Provider>,
  )

  expect(actual).toStrictEqual('serviceOfSinglePoint')
})

test('useServices', async () => {
  const pool = createPluginPool()
  const manyPoint = createPoint('manyPoint', true)

  const pluginOfManyPoint = createPlugin([
    { point: manyPoint, factory: () => 'serviceOfMany' },
    { point: manyPoint, factory: () => 'serviceOfMany-other' },
  ])

  pool.importPlugin(pluginOfManyPoint)

  await pool.resolve()

  let actual
  const runner = () => {
    actual = useServices(manyPoint)
  }

  mount(
    <Provider value={pool}>
      <HookWrapper callback={runner} />
    </Provider>,
  )
  console.log(actual)

  expect(actual).toStrictEqual(['serviceOfMany', 'serviceOfMany-other'])

  expect(true).toBe(true)
})
