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
} from '../src/index'
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
	pipe<ServicePool, T[], boolean>(
		svcPool => svcPool.getServices(name),
		instances => instances[0] === value,
	)

test('deps free', done => {
	const rootDef = createSvcDef({
		point: 'testRoot',
		factory: () => 'testRoot',
	})

	const hasRootInstance = pipe<ServicePool, string[], any, any>(
		svcPool => svcPool.getServices('testRoot'),
		instances => expect(instances).toEqual(['testRoot']),
		done,
	)

	pipe(
		createDefPool,
		pool => registerSvcDef(pool, rootDef),
		resolveDefPool,
		then(svcPool => hasRootInstance(svcPool)),
		otherwise(err => done.fail(err)),
	)()
})

test('resolve with deps', done => {
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

	const assert = pipe<ServicePool, void, any>(
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

	pipe(
		createDefPool,
		defPool => registerSvcDefs(defPool, [rootDef, sub1Def, sub2Def, sub3Def]),
		resolveDefPool,
		then(assert),
		otherwise(err => done.fail(err)),
	)()
})

test('resolve with circular deps', done => {
	const cirDef = createSvcDef({
		point: 'testRoot',
		deps: {
			testRoot: true,
		},
		factory: () => 'never',
	})

	const assertCircularException = pipe<Error, any, any>(
		err => expect(err).toBeInstanceOf(CircularDependency),
		done,
	)

	pipe(
		createDefPool,
		defPool => registerSvcDefs(defPool, [cirDef]),
		resolveDefPool,
		then(() => done.fail()),
		otherwise(assertCircularException),
	)()
})

test('resolve with not registered svc def', done => {
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
		then(() => done.fail()),
		otherwise(assertNotRegisteredException),
	)()
})

test('resolve with many points', done => {
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

	const assertResult = pipe<ServicePool, string[], any, any>(
		pool => pool.getServices('testRoot'),
		instances =>
			expect(instances).toEqual(['testRoot1', 'testRoot2', 'testRoot3']),
		done,
	)

	pipe(
		createDefPool,
		defPool => registerSvcDefs(defPool, [def1, def2, def3]),
		resolveDefPool,
		then(assertResult),
	)()
})

test('resolve optional def without provider', done => {
	const optionalSvcDef = createSvcDef({
		point: 'testRoot',
		deps: { testSub1: false },
		factory: deps => (deps && deps.testSub1) || `optional`,
	})

	const assertSvcInstance = pipe<ServicePool, string[], any, any>(
		pool => pool.getServices('testRoot'),
		instances => expect(instances).toEqual(['optional']),
		done,
	)

	pipe(
		createDefPool,
		defPool => registerSvcDef(defPool, optionalSvcDef),
		resolveDefPool,
		then(assertSvcInstance),
		otherwise(done.fail),
	)()
})

test('resolve optional def with provider', done => {
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

	const assertSvcInstance = pipe<ServicePool, string[], any, any>(
		pool => pool.getServices('testRoot'),
		instances => expect(instances).toEqual(['testRoot-testSub1']),
		done,
	)

	pipe(
		createDefPool,
		defPool => registerSvcDefs(defPool, [consumerSvcDef, optionalSvcDef]),
		resolveDefPool,
		then(assertSvcInstance),
		otherwise(done.fail),
	)()
})
