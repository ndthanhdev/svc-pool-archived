export class BaseError {
  constructor(message?: string) {
    Error.call(this, message)
  }
}

export default BaseError
