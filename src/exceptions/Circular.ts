import { Point } from '../interfaces/Point'
import BaseError from './BaseError'

export class CircularDependency extends BaseError {
	constructor(point: Point) {
		super(`Cannot resolve circular dependencies: ${point}`)
	}
}
