import BaseException from '../base-exception'
import { PointNames } from '../util-types'

export declare class CircularDependency extends BaseException {
	constructor(name: PointNames)
}

export declare class NotRegistered extends BaseException {
	constructor(name: PointNames)
}
