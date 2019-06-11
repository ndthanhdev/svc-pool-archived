import { Point } from '../Point'

export class CircularDependency extends Error {
  constructor(point: Point) {
    super(`Cannot resolve circular dependencies: ${point}`)
  }
}
