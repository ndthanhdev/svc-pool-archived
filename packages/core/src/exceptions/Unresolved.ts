import BaseError from './BaseError'

export class Unresolved extends BaseError {
	constructor() {
		super('Cannot get service from unresolved app')
	}
}
