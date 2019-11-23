import { createSvcDef } from '../src/service-definition'

declare module '@svc-pool/registry' {
	export interface Schema {
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
