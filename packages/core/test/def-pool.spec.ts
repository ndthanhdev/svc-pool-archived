import * as R from 'ramda'
import {
	createSvcDef,
	resolveDefs,
	ServicePool,
	Registry,
	Point,
	ValueTypeOfSvc,
	CircularDependency,
	NotRegistered,
} from '../src'

const hasFirstInstanceEqual = <R extends Registry>(
	name: Point<R>,
	value: ValueTypeOfSvc<R, Point<R>>,
) =>
	R.pipe<ServicePool<R>, ValueTypeOfSvc<R, Point<R>>[], boolean>(
		svcPool => svcPool.getServices(name),
		instances => instances?.[0] === value,
	)

it('deps free', async () => {
	type Registry = {
		a: string
	}

	const aDef0 = createSvcDef<Registry>('a', () => 'a0')

	const hasRootInstance = R.pipe<ServicePool<Registry>, string[], any>(
		svcPool => svcPool.getServices('a'),
		instances => expect(instances).toEqual(['a0']),
	)

	const pool = await resolveDefs(aDef0)
	hasRootInstance(pool)
})

it('deps', async () => {
	type Registry = {
		a: string
		b: string
		ac: string
		bcd: string
	}

	const aDef0 = createSvcDef<Registry>('a', () => 'a0')
	const bDef0 = createSvcDef<Registry>('b', () => 'b0')
	const acDef0 = createSvcDef<Registry>('ac', {
		deps: ['a'],
		factory: ({ a }) => a[0] + 'c0',
	})
	const bcdDef0 = createSvcDef<Registry>('bcd', {
		deps: ['ac', 'b'],
		factory: ({ b, ac }) => b[0] + ac[0] + 'd0',
	})

	const pool = await resolveDefs(aDef0, bcdDef0, acDef0, bDef0)

	expect(pool.getServices('a')).toEqual(['a0'])
	expect(pool.getServices('b')).toEqual(['b0'])
	expect(pool.getServices('ac')).toEqual(['a0c0'])
	expect(pool.getServices('bcd')).toEqual(['b0a0c0d0'])
})

it('resolve with many points', async () => {
	type Registry = {
		a: string
		ab: string
	}

	const aDef0 = createSvcDef<Registry>('a', () => 'a0')
	const aDef1 = createSvcDef<Registry>('a', () => 'a1')
	const aDef2 = createSvcDef<Registry>('a', () => 'a2')

	const bDef0 = createSvcDef<Registry>('ab', {
		deps: ['a'],
		factory: ({ a }) => a?.join('') + 'b0',
	})

	const pool = await resolveDefs(bDef0, aDef0, aDef1, aDef2)

	expect(pool.getServices('ab')).toEqual(['a0a1a2b0'])
})

it('resolve optional dep with provider', async () => {
	type Registry = {
		a: string
		ba: string
	}

	const aDef0 = createSvcDef<Registry>('a', () => 'a0')
	const bDef0 = createSvcDef<Registry>('ba', {
		deps: {
			a: false,
		},
		factory: ({ a }) => (a ?? []).join('') + 'b0',
	})

	const pool = await resolveDefs(aDef0, bDef0)

	expect(pool.getServices('ba')).toEqual(['a0b0'])
})

it('resolve optional dep without provider', async () => {
	type Registry = {
		a: string
		ba: string
	}

	const bDef0 = createSvcDef<Registry>('ba', {
		deps: {
			a: false,
		},
		factory: ({ a }) => (a ?? []).join('') + 'b0',
	})

	const pool = await resolveDefs(bDef0)

	expect(pool.getServices('ba')).toEqual(['b0'])
})

it('undefined point', async () => {
	type Registry = {
		a: string
		b: string
	}

	const aDef0 = createSvcDef<Registry>('a', () => 'a0')

	const pool = await resolveDefs(aDef0)

	expect(pool.getServices('b')).toEqual([])
})

it('circular deps', async () => {
	type Registry = {
		ab: string
		bc: string
		ca: string
	}

	const abDef = createSvcDef<Registry>('ab', {
		deps: ['ca'],
		factory: () => 'ca',
	})
	const bcDef = createSvcDef<Registry>('bc', {
		deps: ['ab'],
		factory: () => 'bc',
	})
	const caDef = createSvcDef<Registry>('ca', {
		deps: ['bc'],
		factory: () => 'ca',
	})

	await expect(resolveDefs(abDef, bcDef, caDef)).rejects.toThrow(
		CircularDependency,
	)
})

it('missing deps', async () => {
	type Registry = {
		a: string
		ba: string
	}

	const bDef0 = createSvcDef<Registry>('ba', {
		deps: ['a'],
		factory: ({ a }) => a.join('') + 'b0',
	})

	await expect(resolveDefs(bDef0)).rejects.toThrow(NotRegistered)
})
