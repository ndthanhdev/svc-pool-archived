import { Point } from '../Point'
import BaseError from './BaseError'

export class NotRegistered extends BaseError {
	constructor(point: Point) {
		super(`Point requested was not registered yet: ${point}`)
	}
}
