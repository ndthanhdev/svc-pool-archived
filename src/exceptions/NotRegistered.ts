import { Point } from "../interfaces/Point";

export class NotRegistered extends Error {
  constructor(point: Point) {
    super(`Point requested was not registered yet: ${point}`);
  }
}