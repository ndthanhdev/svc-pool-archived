export class Point {
  constructor(
    public readonly name: string,
    public readonly many: boolean = false,
  ) {}

  toString() {
    return this.name
  }
}
