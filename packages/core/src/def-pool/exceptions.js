import BaseException from '../base-exception'

export class CircularDependency extends BaseException {
	constructor(name) {
		super(`cannot resolve circular dependencies: ${name}`)
	}
}

export class NotRegistered extends BaseException {
	constructor(name) {
		super(`Point requested was not registered yet: ${name}`)
	}
}
