export interface IServiceFactory {
  (deps: any): Promise<any> | any
}
