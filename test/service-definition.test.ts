import { createSvcDef } from '../dist'

declare module '../registry' {
	// eslint-disable-next-line jest/no-export
	export default interface Registry {
		'createSvcDef-svc': string[]
	}
}

test('create plugin without error', () => {
	const svcDef = createSvcDef({
		point: 'createSvcDef-svc',
		factory: () => 'createSvcDef-svc',
	})

	expect(svcDef).toBeDefined()
})
