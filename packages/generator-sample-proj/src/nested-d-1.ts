import * as core from '@svc-pool/core'
import * as nested2 from './nested-d-2'
import { SampleInterface, SampleType } from './nested-types'

declare module '@svc-pool/core/registry' {
	export default interface Registry {
		nested1Str: string[]
		nested1Interface: SampleInterface[]
		nested1Type: SampleType[]
	}
}

export default {}
