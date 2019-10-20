import { CircularDependency } from '../src/exceptions/Circular'
import { NotRegistered } from '../src/exceptions/NotRegistered'
import { createPlugin, createDefinitionPool } from '../src'
import { IServiceDefinition } from '../src/interfaces/ServiceDefinition'

declare module '../registry' {
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
		const definitions = createDefinitionPool()

		definitions.importPlugin(createPlugin([rootDef]))

		const pool = await definitions.resolve()

		const instance = pool.getServices('test-root')

		expect(instance).toEqual(['Root'])
	})

	test('with deps', async () => {
		const definitions = createDefinitionPool()

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

		definitions.importPlugin(createPlugin([rootDef, sub1Def, sub2Def, sub3Def]))

		const pool = await definitions.resolve()

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

		const pool = createDefinitionPool()
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
		const pool = createDefinitionPool()

		pool.importPlugin(createPlugin([notRegisteredDef]))

		await expect(pool.resolve()).rejects.toBeInstanceOf(NotRegistered)
	})
})

describe('many points', () => {
	test('many points test', async () => {
		const definitions = createDefinitionPool()

		const many = 'test-many'

		definitions.importPlugin(
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

		const pool = await definitions.resolve()

		expect(pool.getServices('test-many')).toEqual([
			'instance 1',
			'instance 2',
			'instance 3',
		])
	})
})

describe('optional', () => {
	test('without provider', async () => {
		const definitions = createDefinitionPool()
		const testPoint = 'test-root'
		const optionalPoint = 'optional'

		definitions.importPlugin(
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

		const pool = await definitions.resolve()

		expect(pool.getServices('test-root')).toEqual([
			'default test point instance',
		])
	})

	test('with provider', async () => {
		const definitions = createDefinitionPool()
		const testPoint = 'test-root'
		const optionalPoint = 'optional'

		definitions.importPlugin(
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

		const pool = await definitions.resolve()

		expect(pool.getServices('test-root')).toEqual([
			'optional test point instance',
		])
	})
})

test('importPlugins', async () => {
	const definitions = createDefinitionPool()
	const rootPoint = 'test-root'

	definitions.importPlugins([
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

	const pool = await definitions.resolve()
	expect(pool.getServices(rootPoint)).toEqual(['svc-1', 'svc-2'])
})

test('chaining', done => {
	const definitions = createDefinitionPool()
	const rootPoint = 'test-root'

	const plugin1 = createPlugin([
		{
			point: rootPoint,
			factory: () => 'svc-1',
		},
	])

	const plugin2 = createPlugin([
		{
			point: rootPoint,
			factory: () => 'svc-2',
		},
	])

	definitions
		.importPlugin(plugin1)
		.importPlugin(plugin2)
		.resolve()
		.then(pool => {
			expect(pool.getServices(rootPoint)).toEqual(['svc-1', 'svc-2'])
		})
		.then(done)
})
