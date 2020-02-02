// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as core from '@svc-pool/core'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as nested2 from './nested-d-2'
import { SampleInterface } from './nested-types'
import { SampleType } from "@src/SampleType"

declare module '@svc-pool/core/registry' {
	export default interface Registry {
		nested1Str: string[]
		nested1Interface: SampleInterface[]
		nested1Type: SampleType[]
	}
}
