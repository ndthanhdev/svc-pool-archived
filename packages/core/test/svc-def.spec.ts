import { createSvcDef } from '../src'

type Registry = {
	a: string
	b: string
}

it(createSvcDef.name, () => {
	const def = createSvcDef<Registry>('a', () => 'a0')

	expect(def.deps).toBeDefined()
})

it(createSvcDef.name + 'array deps', () => {
	const def = createSvcDef<Registry>('b', {
		deps: ['a'],
		factory: () => 'b0',
	})

	expect(def.deps?.['a']).toBeDefined()
})

it(createSvcDef.name + 'map deps', () => {
	const def = createSvcDef<Registry>('b', {
		deps: {
			a: true,
		},
		factory: () => 'b0',
	})

	expect(def.deps?.['a']).toBeDefined()
})

it(createSvcDef.name + 'falsy deps', () => {
	const depsUndefined = createSvcDef<Registry>('b', {
		factory: () => 'b0',
	})
	const depsNull = createSvcDef<Registry>('b', {
		deps: null,
		factory: () => 'b0',
	})

	const defEmptyArray = createSvcDef<Registry>('b', {
		deps: [],
		factory: () => 'b0',
	})

	const defEmptyMap = createSvcDef<Registry>('b', {
		deps: {},
		factory: () => 'b0',
	})

	expect(depsUndefined.deps).toBeDefined()
	expect(depsNull.deps).toBeDefined()
	expect(defEmptyArray.deps).toBeDefined()
	expect(defEmptyMap.deps).toBeDefined()
})
