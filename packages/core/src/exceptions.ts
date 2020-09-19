class BaseException extends Error {}

export class CircularDependency extends BaseException {
	constructor(name: any) {
		super(`cannot resolve circular dependencies: ${name}`)
	}
}

export class NotRegistered extends BaseException {
	constructor(name: any) {
		super(`Point requested was not registered yet: ${name}`)
	}
}
