import { Point } from '../Point'

export class NotMany extends Error {
  constructor(point: Point) {
    super(`${point} is only accept one provider`)
  }
}
