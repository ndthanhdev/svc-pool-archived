import { createPlugin, createPoint, createPluginPool } from "../src";
import { IServiceDefinition } from "../src/interfaces/ServiceDefinition";

const root = createPoint('root')
const sub1 = createPoint('sub1')
const sub2 = createPoint('sub2')
const sub3 = createPoint('sub3')


const rootDef: IServiceDefinition = {
  point: root,
  deps: {},
  factory: () => 'root'
}

const subDef1: IServiceDefinition = {
  point: sub1,
  deps: {
    root: root
  },
  factory: ({
    root
  }) => root + 'Sub'
}

const subDef2: IServiceDefinition = {
  point: sub2,
  deps: {
    sub1: sub1
  },
  factory: ({
    sub1
  }) => sub1 + 'Sub'
}

const subDef3: IServiceDefinition = {
  point: sub3,
  deps: {
    sub1: sub1,
    sub2: sub2
  },
  factory: ({
    sub1,
    sub2
  }) => sub1 + sub2
}

test('deps free', async () => {
  const pool = createPluginPool()

  pool.importPlugin(createPlugin([rootDef]))

  await pool.resolve()

  const instance = pool.getService(root)

  expect(instance).toBe('root')
})

test('with deps', async () => {
  const pool = createPluginPool()

  pool.importPlugin(createPlugin([rootDef, subDef1, subDef2, subDef3]))

  await pool.resolve()

  expect(pool.getService(sub1)).toBe('rootSub')
  expect(pool.getService(sub2)).toBe('rootSubSub')
  expect(pool.getService(sub3)).toBe('rootSubrootSubSub')
})