export class BaseException {
	constructor(message?: string) {
		Error.call(this, message)
	}
}

export default BaseException
