import './nested-d-2'

declare module '@svc-pool/core/registry' {
	export default interface Registry {
		root: any[]
	}
}

export default {}