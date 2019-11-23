export default class BaseException {
	constructor(message?: string) {
		Error.call(this, message)
	}
}
