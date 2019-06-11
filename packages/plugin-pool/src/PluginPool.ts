import { IPlugin } from './interfaces/Plugin'
import { Point } from './Point'
import {
  IServiceDefinition,
  IFullServiceDefinition,
  IFullDependenciesMap,
  IFullDependencyDefinition,
} from './interfaces/ServiceDefinition'
import { CircularDependency } from './exceptions/Circular'
import { NotRegistered } from './exceptions/NotRegistered'
import { Unresolved } from './exceptions/Unresolved'
import { NotMany } from './exceptions/NotMany'

function convertToFullDefinition({
  deps = {},
  point,
  factory,
}: IServiceDefinition): IFullServiceDefinition {
  const re: IFullServiceDefinition = {
    point,
    factory,
    deps: {},
  }

  re.deps = Object.keys(deps).reduce(
    (acc, k) => {
      const depDef = deps[k]
      if (depDef instanceof Point) {
        acc[k] = {
          point: depDef,
          optional: false,
        }
      } else {
        acc[k] = depDef
      }
      return acc
    },
    {} as IFullDependenciesMap,
  )

  return re
}

export default class PluginPool {
  private registered: Map<Point, IFullServiceDefinition[]> = new Map<
    Point,
    IFullServiceDefinition[]
  >()
  private points: Point[] = []
  private theGetServices: ((point: Point) => any[] | undefined) | null = null

  importPlugin(plugin: IPlugin) {
    plugin.forEach(definition => this.register(definition))
  }

  register(definition: IServiceDefinition) {
    const theDefinition = convertToFullDefinition(definition)
    if (this.registered.has(definition.point)) {
      if (theDefinition.point.many) {
        const inStock = <IFullServiceDefinition[]>(
          this.registered.get(definition.point)
        )
        this.registered.set(definition.point, [...inStock, theDefinition])
      } else {
        throw new NotMany(definition.point)
      }
    } else {
      this.registered.set(definition.point, [theDefinition])
    }

    this.points.push(definition.point)
  }

  async resolve() {
    const resolved = new Map<Point, any[]>() // point -> service/services
    const resolving = new Set()

    const saveToResolved = (point: Point, oneOrManyInstances: any) => {
      if (point.many) {
        const inStock = resolved.get(point) || []
        resolved.set(point, [...inStock, oneOrManyInstances])
      } else {
        resolved.set(point, oneOrManyInstances)
      }
    }

    // recursive resolve point
    const resolvePoint = async (point: Point, root = false) => {
      const resolveDef = async (def: IFullDependencyDefinition) => {
        const definitions = this.registered.get(def.point)

        if (!definitions) {
          if (def.optional) {
            return undefined
          }
          throw new NotRegistered(point)
        } else {
          return await resolvePoint(def.point)
        }
      }

      const resolveService = async (definition: IFullServiceDefinition) => {
        const deps = definition.deps
        const resolvedDeps: any = {}

        for (const key in deps) {
          const registeredPoint = deps[key]
          resolvedDeps[key] = await resolveDef(registeredPoint)
        }

        const instance = await definition.factory(resolvedDeps)

        return instance
      }

      const resolveServices = async (definitions: IFullServiceDefinition[]) => {
        const instances = []

        for (const def of definitions) {
          instances.push(await resolveService(def))
        }
        return instances
      }

      if (resolved.has(point) && !root) {
        return resolved.get(point)
      }

      // if currently resolving the same type, we have a circular dependency
      if (resolving.has(point)) {
        throw new CircularDependency(point)
      }

      resolving.add(point)

      const definitions = this.registered.get(point) as IFullServiceDefinition[]

      const instanceOrInstances = await resolveServices(definitions)

      resolving.delete(point)
      saveToResolved(point, instanceOrInstances)

      return instanceOrInstances
    }

    // resolve points serially
    for (const point of this.points) {
      await resolvePoint(point, true)
    }

    this.theGetServices = (point: Point) => resolved.get(point)
  }

  getServices(point: Point) {
    if (!this.theGetServices) {
      throw new Unresolved()
    }
    return this.theGetServices(point)
  }

  getService(point: Point) {
    const mayBeServices = this.getServices(point)
    return mayBeServices && mayBeServices[0]
  }
}
