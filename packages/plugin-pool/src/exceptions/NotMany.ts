import { Point } from '../Point'
import BaseError from './BaseError';

export class NotMany extends BaseError {
  constructor(point: Point) {
    super(`${point} is only accept one provider`)
  }
}
