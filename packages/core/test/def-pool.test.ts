import R from 'ramda'
import {
	createDefPool,
	registerSvcDef,
	registerSvcDefs,
	resolveDefPool,
	createSvcDef,
	ServicePool,
	CircularDependency,
	NotRegistered,
} from '@src/index'
import { PointNames, ValueTypeOfSvc } from '@svc-pool/registry'

describe('create test', () => {
	expect(createDefPool()).toBeDefined()
})

declare module '@svc-pool/registry' {
	export default interface Schema {
		testRoot: any[]
		testSub1: any[]
		testSub2: any[]
		testSub3: any[]
		testMany: any[]
		testOptionalDep: any[]
	}
}

const hasFirstInstanceEqual = <T extends PointNames>(
	name: PointNames,
	value: ValueTypeOfSvc<T>,
) =>
	R.pipe<ServicePool, T[], boolean>(
		svcPool => svcPool.getServices(name),
		instances => instances[0] === value,
	)

describe('deps', () => {
	const root = 'test-root'

	const rootDef = createSvcDef({
		point: 'testRoot',
		factory: () => 'testRoot',
	})

	test('deps free', done => {
		const hasRootInstance = R.pipe<ServicePool, string[], any, any>(
			svcPool => svcPool.getServices('testRoot'),
			instances => expect(instances).toEqual(['testRoot']),
			done,
		)

		R.pipe(
			createDefPool,
			pool => registerSvcDef(pool, rootDef),
			resolveDefPool,
			R.then(svcPool => hasRootInstance(svcPool)),
			R.otherwise(err => done.fail(err)),
		)()
	})

	test('with deps', done => {
		const sub1Def = createSvcDef({
			point: 'testSub1',
			deps: {
				testRoot: true,
			},
			factory: deps => `${deps && deps.testRoot && deps.testRoot[0]}-testSub1`,
		})

		const sub2Def = createSvcDef({
			point: 'testSub2',
			deps: {
				testSub1: true,
			},
			factory: deps => `${deps && deps.testSub1 && deps.testSub1[0]}-testSub2`,
		})

		const sub3Def = createSvcDef({
			point: 'testSub3',
			deps: {
				testSub1: true,
				testSub2: true,
			},
			factory: deps =>
				`${deps && deps.testSub1 && deps.testSub1[0]}-${deps &&
					deps.testSub2 &&
					deps.testSub2[0]}`,
		})

		const assert = R.pipe<ServicePool, void, any>(
			svcPool => {
				expect(
					hasFirstInstanceEqual('testSub1', 'testRoot-testSub1')(svcPool),
				).toBeTruthy()

				expect(
					hasFirstInstanceEqual('testSub2', 'testRoot-testSub1-testSub2')(
						svcPool,
					),
				).toBeTruthy()

				expect(
					hasFirstInstanceEqual(
						'testSub3',
						'testRoot-testSub1-testRoot-testSub1-testSub2',
					)(svcPool),
				).toBeTruthy()

				return false
			},
			done,
		)

		R.pipe(
			createDefPool,
			defPool => registerSvcDefs(defPool, [rootDef, sub1Def, sub2Def, sub3Def]),
			resolveDefPool,
			R.then(assert),
			R.otherwise(err => done.fail(err)),
		)()
	})

	test('circular deps', done => {
		const cirDef = createSvcDef({
			point: 'testRoot',
			deps: {
				testRoot: true,
			},
			factory: () => 'never',
		})

		const assertCircularException = R.pipe<Error, any, any>(
			err => expect(err).toBeInstanceOf(CircularDependency),
			done,
		)

		R.pipe(
			createDefPool,
			defPool => registerSvcDefs(defPool, [cirDef]),
			resolveDefPool,
			R.then(() => done.fail()),
			R.otherwise(assertCircularException),
		)()
	})

	test('not registered', done => {
		const notRegisteredDef = createSvcDef({
			point: 'testRoot',
			deps: {
				testSub1: true,
			},
			factory: () => 'never',
		})

		const assertNotRegisteredException = R.pipe<Error, any, any>(
			err => expect(err).toBeInstanceOf(NotRegistered),
			done,
		)

		R.pipe(
			createDefPool,
			defPool => registerSvcDef(defPool, notRegisteredDef),
			resolveDefPool,
			R.then(() => done.fail()),
			R.otherwise(assertNotRegisteredException),
		)()
	})
})

// describe('many points', () => {
// 	test('many points test', async () => {
// 		const definitions = createDefinitionPool()

// 		const many = 'test-many'

// 		definitions.importPlugin(
// 			createPlugin([
// 				{
// 					point: many,
// 					factory: () => 'instance 1',
// 				},
// 				{
// 					point: many,
// 					factory: () => 'instance 2',
// 				},
// 				{
// 					point: many,
// 					factory: () => 'instance 3',
// 				},
// 			]),
// 		)

// 		const pool = await definitions.resolve()

// 		expect(pool.getServices('test-many')).toEqual([
// 			'instance 1',
// 			'instance 2',
// 			'instance 3',
// 		])
// 	})
// })

// describe('optional', () => {
// 	test('without provider', async () => {
// 		const definitions = createDefinitionPool()
// 		const testPoint = 'test-root'
// 		const optionalPoint = 'optional'

// 		definitions.importPlugin(
// 			createPlugin([
// 				{
// 					point: testPoint,
// 					deps: {
// 						optionalParam: {
// 							point: optionalPoint,
// 							optional: true,
// 						},
// 					},
// 					factory: ({ optionalParam }) =>
// 						`${optionalParam || 'default'} test point instance`,
// 				},
// 			]),
// 		)

// 		const pool = await definitions.resolve()

// 		expect(pool.getServices('test-root')).toEqual([
// 			'default test point instance',
// 		])
// 	})

// 	test('with provider', async () => {
// 		const definitions = createDefinitionPool()
// 		const testPoint = 'test-root'
// 		const optionalPoint = 'optional'

// 		definitions.importPlugin(
// 			createPlugin([
// 				{
// 					point: testPoint,
// 					deps: {
// 						optionalParam: {
// 							point: optionalPoint,
// 							optional: true,
// 						},
// 					},
// 					factory: ({ optionalParam }) =>
// 						`${optionalParam || 'default'} test point instance`,
// 				},
// 				{
// 					point: optionalPoint,
// 					factory: () => 'optional',
// 				},
// 			]),
// 		)

// 		const pool = await definitions.resolve()

// 		expect(pool.getServices('test-root')).toEqual([
// 			'optional test point instance',
// 		])
// 	})
// })

// test('importPlugins', async () => {
// 	const definitions = createDefinitionPool()
// 	const rootPoint = 'test-root'

// 	definitions.importPlugins([
// 		createPlugin([
// 			{
// 				point: rootPoint,
// 				factory: () => 'svc-1',
// 			},
// 		]),
// 		createPlugin([
// 			{
// 				point: rootPoint,
// 				factory: () => 'svc-2',
// 			},
// 		]),
// 	])

// 	const pool = await definitions.resolve()
// 	expect(pool.getServices(rootPoint)).toEqual(['svc-1', 'svc-2'])
// })

// test('chaining', done => {
// 	const definitions = createDefinitionPool()
// 	const rootPoint = 'test-root'

// 	const plugin1 = createPlugin([
// 		{
// 			point: rootPoint,
// 			factory: () => 'svc-1',
// 		},
// 	])

// 	const plugin2 = createPlugin([
// 		{
// 			point: rootPoint,
// 			factory: () => 'svc-2',
// 		},
// 	])

// 	definitions
// 		.importPlugin(plugin1)
// 		.importPlugin(plugin2)
// 		.resolve()
// 		.then(pool => {
// 			expect(pool.getServices(rootPoint)).toEqual(['svc-1', 'svc-2'])
// 		})
// 		.then(done)
// })
