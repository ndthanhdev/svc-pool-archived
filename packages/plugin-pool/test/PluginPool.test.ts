import { createPlugin, createPluginPool } from '../src/index'
import { IServiceDefinition } from '../src/interfaces/ServiceDefinition'
import { Unresolved } from '../src/exceptions/Unresolved'
import { CircularDependency } from '../src/exceptions/Circular'
import { NotRegistered } from '../src/exceptions/NotRegistered'

declare module '../src/registry' {
	export interface ServiceResolutionTypes {
		'test-root': any[]
		'test-sub1': any[]
		'test-sub2': any[]
		'test-sub3': any[]
		'test-many': any[]
		'test-optional-dep': any[]
	}
}

describe('deps', () => {
	const root = 'test-root'

	const rootDef: IServiceDefinition = {
		point: root,
		deps: {},
		factory: () => 'Root',
	}

	test('deps free', async () => {
		const pool = createPluginPool()

		pool.importPlugin(createPlugin([rootDef]))

		await pool.resolve()

		const instance = pool.getServices('test-root')

		expect(instance).toEqual(['Root'])
	})

	test('with deps', async () => {
		const pool = createPluginPool()

		const sub1 = 'test-sub1'
		const sub2 = 'test-sub2'
		const sub3 = 'test-sub3'

		const sub1Def: IServiceDefinition = {
			point: sub1,
			deps: {
				root,
			},
			factory: ({ root }) => `${root[0]}Sub`,
		}

		const sub2Def: IServiceDefinition = {
			point: sub2,
			deps: {
				sub1,
			},
			factory: ({ sub1 }) => `${sub1[0]}Sub`,
		}

		const sub3Def: IServiceDefinition = {
			point: sub3,
			deps: {
				sub1,
				sub2,
			},
			factory: ({ sub1, sub2 }) => sub1[0] + sub2[0],
		}

		pool.importPlugin(createPlugin([rootDef, sub1Def, sub2Def, sub3Def]))

		await pool.resolve()

		expect(pool.getServices('test-sub1')).toEqual(['RootSub'])
		expect(pool.getServices('test-sub2')).toEqual(['RootSubSub'])
		expect(pool.getServices('test-sub3')).toEqual(['RootSubRootSubSub'])
	})

	test('circular deps', async () => {
		const circularDef: IServiceDefinition = {
			point: root,
			deps: {
				root: 'test-root',
			},
			factory: () => 'never',
		}

		const pool = createPluginPool()
		pool.importPlugin(createPlugin([circularDef]))

		await expect(pool.resolve()).rejects.toBeInstanceOf(CircularDependency)
	})

	test('not registered', async () => {
		const notRegisteredDef: IServiceDefinition = {
			point: root,
			deps: {
				notRegisteredPoint: 'test-not-registered-point',
			},
			factory: () => 'never',
		}
		const pool = createPluginPool()

		pool.importPlugin(createPlugin([notRegisteredDef]))

		await expect(pool.resolve()).rejects.toBeInstanceOf(NotRegistered)
	})
})

describe('many points', () => {
	test('many points test', async () => {
		const pool = createPluginPool()

		const many = 'test-many'

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

		expect(pool.getServices('test-many')).toEqual([
			'instance 1',
			'instance 2',
			'instance 3',
		])
	})
})

describe('optional', () => {
	test('without provider', async () => {
		const pool = createPluginPool()
		const testPoint = 'test-root'
		const optionalPoint = 'optional'

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

		expect(pool.getServices('test-root')).toEqual([
			'default test point instance',
		])
	})

	test('with provider', async () => {
		const pool = createPluginPool()
		const testPoint = 'test-root'
		const optionalPoint = 'optional'

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

		expect(pool.getServices('test-root')).toEqual([
			'optional test point instance',
		])
	})
})

test('Unresolved', () => {
	expect(() => {
		const pool = createPluginPool()
		pool.getServices('test-root')
	}).toThrowError(Unresolved)
})

test('importPlugins', async () => {
	const pool = createPluginPool()
	const rootPoint = 'test-root'

	pool.importPlugins([
		createPlugin([
			{
				point: rootPoint,
				factory: () => 'svc-1',
			},
		]),
		createPlugin([
			{
				point: rootPoint,
				factory: () => 'svc-2',
			},
		]),
	])

	await pool.resolve()
	expect(pool.getServices(rootPoint)).toEqual(['svc-1', 'svc-2'])
})
