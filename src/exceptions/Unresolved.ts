export class Unresolved extends Error {
  constructor() {
    super('Cannot get service from unresolved app');
  }
}