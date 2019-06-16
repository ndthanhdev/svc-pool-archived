import { createPlugin, createPoint, createPluginPool } from '../src/index'
import { IServiceDefinition } from '../src/interfaces/ServiceDefinition'
import { Unresolved } from '../src/exceptions/Unresolved'
import { CircularDependency } from '../src/exceptions/Circular'
import { NotMany } from '../src/exceptions/NotMany'
import { NotRegistered } from '../src/exceptions/NotRegistered'

describe('deps test', () => {
  const root = createPoint('root')

  const rootDef: IServiceDefinition = {
    point: root,
    deps: {},
    factory: () => 'Root',
  }

  test('deps free', async () => {
    const pool = createPluginPool()

    pool.importPlugin(createPlugin([rootDef]))

    await pool.resolve()

    const instance = pool.getService(root)

    expect(instance).toEqual('Root')
  })

  test('with deps', async () => {
    const pool = createPluginPool()

    const sub1 = createPoint('sub1')
    const sub2 = createPoint('sub2')
    const sub3 = createPoint('sub3')

    const sub1Def: IServiceDefinition = {
      point: sub1,
      deps: {
        root,
      },
      factory: ({ root }) => `${root}Sub`,
    }

    const sub2Def: IServiceDefinition = {
      point: sub2,
      deps: {
        sub1,
      },
      factory: ({ sub1 }) => `${sub1}Sub`,
    }

    const sub3Def: IServiceDefinition = {
      point: sub3,
      deps: {
        sub1,
        sub2,
      },
      factory: ({ sub1, sub2 }) => sub1 + sub2,
    }

    pool.importPlugin(createPlugin([rootDef, sub1Def, sub2Def, sub3Def]))

    await pool.resolve()

    expect(pool.getService(sub1)).toEqual('RootSub')
    expect(pool.getService(sub2)).toEqual('RootSubSub')
    expect(pool.getService(sub3)).toEqual('RootSubRootSubSub')
  })

  test('circular deps', async () => {
    const circularDef: IServiceDefinition = {
      point: root,
      deps: {
        root,
      },
      factory: () => 'never',
    }

    const pool = createPluginPool()
    pool.importPlugin(createPlugin([circularDef]))

    await expect(pool.resolve()).rejects.toBeInstanceOf(CircularDependency)
  })

  test('not registered', async () => {
    const dependOnNotRegistered = createPoint('notRegistered')

    const notRegisteredDef: IServiceDefinition = {
      point: dependOnNotRegistered,
      deps: {
        root,
      },
      factory: () => 'never',
    }
    const pool = createPluginPool()

    pool.importPlugin(createPlugin([notRegisteredDef]))

    await expect(pool.resolve()).rejects.toBeInstanceOf(NotRegistered)
  })
})

describe('many', () => {
  test('many point', async () => {
    const pool = createPluginPool()

    const many = createPoint('many', true)

    pool.importPlugin(
      createPlugin([
        {
          point: many,
          factory: () => 'instance 1',
        },
        {
          point: many,
          factory: () => 'instance 2',
        },
        {
          point: many,
          factory: () => 'instance 3',
        },
      ]),
    )

    await pool.resolve()

    expect(pool.getService(many)).toEqual([
      'instance 1',
      'instance 2',
      'instance 3',
    ])
  })

  test('not many', () => {
    const pool = createPluginPool()

    const notMany = createPoint('notMany')

    function check() {
      pool.importPlugin(
        createPlugin([
          {
            point: notMany,
            factory: () => 'instance 1',
          },
          {
            point: notMany,
            factory: () => 'instance 2',
          },
          {
            point: notMany,
            factory: () => 'instance 3',
          },
        ]),
      )
    }

    expect(check).toThrowError(NotMany)
  })
})

describe('optional', () => {
  test('without provider', async () => {
    const pool = createPluginPool()
    const testPoint = createPoint('testPoint')
    const optionalPoint = createPoint('optional')

    pool.importPlugin(
      createPlugin([
        {
          point: testPoint,
          deps: {
            optionalParam: {
              point: optionalPoint,
              optional: true,
            },
          },
          factory: ({ optionalParam }) =>
            `${optionalParam || 'default'} test point instance`,
        },
      ]),
    )

    await pool.resolve()

    expect(pool.getService(testPoint)).toEqual('default test point instance')
  })

  test('with provider', async () => {
    const pool = createPluginPool()
    const testPoint = createPoint('testPoint')
    const optionalPoint = createPoint('optional')

    pool.importPlugin(
      createPlugin([
        {
          point: testPoint,
          deps: {
            optionalParam: {
              point: optionalPoint,
              optional: true,
            },
          },
          factory: ({ optionalParam }) =>
            `${optionalParam || 'default'} test point instance`,
        },
        {
          point: optionalPoint,
          factory: () => 'optional',
        },
      ]),
    )

    await pool.resolve()

    expect(pool.getService(testPoint)).toEqual('optional test point instance')
  })
})

test('Unresolved', () => {
  expect(() => {
    const testPoint = createPoint('testPoint')

    const pool = createPluginPool()
    pool.getService(testPoint)
  }).toThrowError(Unresolved)
})
