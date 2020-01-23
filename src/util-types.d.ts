import Registry from '../registry'

export type PointNames = keyof Registry

export type ValueTypeOfSvc<T extends PointNames> = Registry[T][number]
