import { createSvcDef } from '../dist'

declare module '../registry' {
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
