import { pipe, then, otherwise } from 'ramda'
import {
	createDefPool,
	registerSvcDef,
	registerSvcDefs,
	resolveDefPool,
	createSvcDef,
	ServicePool,
	CircularDependency,
	NotRegistered,
	ValueTypeOfSvc,
	PointNames,
} from '../dist'
import Registry from '../registry'

test('create test', () => {
	const a = createDefPool()
	expect(a).toBeDefined()
})

declare module '../registry' {
	// eslint-disable-next-line jest/no-export
	export default interface Registry {
		testRoot: any[]
		testSub1: any[]
		testSub2: any[]
		testSub3: any[]
		testMany: any[]
		testOptionalDep: any[]
	}
}

const hasFirstInstanceEqual = <T extends PointNames>(
	name: T,
	value: ValueTypeOfSvc<T>,
) =>
	pipe<ServicePool, Registry[T], boolean>(
		svcPool => svcPool.getServices(name),
		instances => instances[0] === value,
	)

test('deps free', async () => {
	const rootDef = createSvcDef({
		point: 'testRoot',
		factory: () => 'testRoot',
	})

	const hasRootInstance = pipe<ServicePool, string[], any>(
		svcPool => svcPool.getServices('testRoot'),
		instances => expect(instances).toEqual(['testRoot']),
	)

	await pipe(
		createDefPool,
		pool => registerSvcDef(pool, rootDef),
		resolveDefPool,
		then(svcPool => hasRootInstance(svcPool)),
		otherwise(err => {
			throw err
		}),
	)()
})

test('resolve with deps', async () => {
	const rootDef = createSvcDef({
		point: 'testRoot',
		factory: () => 'testRoot',
	})

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

	const assert = pipe<ServicePool, void>(svcPool => {
		expect(
			hasFirstInstanceEqual('testSub1', 'testRoot-testSub1')(svcPool),
		).toBeTruthy()

		expect(
			hasFirstInstanceEqual('testSub2', 'testRoot-testSub1-testSub2')(svcPool),
		).toBeTruthy()

		expect(
			hasFirstInstanceEqual(
				'testSub3',
				'testRoot-testSub1-testRoot-testSub1-testSub2',
			)(svcPool),
		).toBeTruthy()

		return false
	})

	pipe(
		createDefPool,
		defPool => registerSvcDefs(defPool, [rootDef, sub1Def, sub2Def, sub3Def]),
		resolveDefPool,
		then(assert),
		otherwise(err => {
			throw err
		}),
	)()
})

test('resolve with circular deps', async () => {
	const cirDef = createSvcDef({
		point: 'testRoot',
		deps: {
			testRoot: true,
		},
		factory: () => 'never',
	})

	const assertCircularException = pipe<Error, any>(err =>
		expect(err).toBeInstanceOf(CircularDependency),
	)

	await pipe(
		createDefPool,
		defPool => registerSvcDefs(defPool, [cirDef]),
		resolveDefPool,
		then(() => {
			throw 'should throw'
		}),
		otherwise(assertCircularException),
	)()
})

test('resolve with not registered svc def', () => {
	return new Promise(done => {
		const notRegisteredDef = createSvcDef({
			point: 'testRoot',
			deps: {
				testSub1: true,
			},
			factory: () => 'never',
		})

		const assertNotRegisteredException = pipe<Error, any, any>(
			err => expect(err).toBeInstanceOf(NotRegistered),
			done,
		)

		pipe(
			createDefPool,
			defPool => registerSvcDef(defPool, notRegisteredDef),
			resolveDefPool,
			then(() => {
				throw 'should throw'
			}),
			otherwise(assertNotRegisteredException),
		)()
	})
})

test('resolve with many points', async () => {
	const def1 = createSvcDef({
		point: 'testRoot',
		factory: () => 'testRoot1',
	})

	const def2 = createSvcDef({
		point: 'testRoot',
		factory: () => 'testRoot2',
	})

	const def3 = createSvcDef({
		point: 'testRoot',
		factory: () => 'testRoot3',
	})

	const assertResult = pipe<ServicePool, string[], any>(
		pool => pool.getServices('testRoot'),
		instances =>
			expect(instances).toEqual(['testRoot1', 'testRoot2', 'testRoot3']),
	)

	await pipe(
		createDefPool,
		defPool => registerSvcDefs(defPool, [def1, def2, def3]),
		resolveDefPool,
		then(assertResult),
	)()
})

test('resolve optional def without provider', async () => {
	const optionalSvcDef = createSvcDef({
		point: 'testRoot',
		deps: { testSub1: false },
		factory: deps => (deps && deps.testSub1) || `optional`,
	})

	const assertSvcInstance = pipe<ServicePool, string[], any>(
		pool => pool.getServices('testRoot'),
		instances => expect(instances).toEqual(['optional']),
	)

	await pipe(
		createDefPool,
		defPool => registerSvcDef(defPool, optionalSvcDef),
		resolveDefPool,
		then(assertSvcInstance),
	)()
})

test('resolve optional def with provider', async () => {
	const optionalSvcDef = createSvcDef({
		point: 'testSub1',
		factory: () => 'testSub1',
	})

	const consumerSvcDef = createSvcDef({
		point: 'testRoot',
		deps: {
			testSub1: false,
		},
		factory: deps => deps && deps.testSub1 && `testRoot-${deps.testSub1[0]}`,
	})

	const assertSvcInstance = pipe<ServicePool, string[], any>(
		pool => pool.getServices('testRoot'),
		instances => expect(instances).toEqual(['testRoot-testSub1']),
	)

	await pipe(
		createDefPool,
		defPool => registerSvcDefs(defPool, [consumerSvcDef, optionalSvcDef]),
		resolveDefPool,
		then(assertSvcInstance),
	)()
})
