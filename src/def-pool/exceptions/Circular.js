import BaseException from '../../base-exception'

export class CircularDependency extends BaseException {
	constructor(name) {
		super(`cannot resolve circular dependencies: ${name}`)
	}
}
