import BaseException from '../../base-exception'

export class NotRegistered extends BaseException {
	constructor(name) {
		super(`Point requested was not registered yet: ${name}`)
	}
}
