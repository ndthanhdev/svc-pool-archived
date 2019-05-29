import { IPlugin } from "./interfaces/Plugin";
import { Point } from "./interfaces/Point";
import { IServiceDefinition, IFullServiceDefinition } from "./interfaces/ServiceDefinition";
import { CircularDependency } from "./exceptions/Circular";
import { NotRegistered } from "./exceptions/NotRegistered";
import { Unresolved } from "./exceptions/Unresolved";

function createOptionalDefinition(point: Point): IFullServiceDefinition {
  return {
    point,
    deps: {},
    factory: () => undefined
  }
}

function convertToFullDefinition(def: IServiceDefinition): IFullServiceDefinition {
  let re: IFullServiceDefinition = {
    deps: {},
    ...def
  }

  return re
}

export default class PluginPool {
  private registered: Map<Point, IFullServiceDefinition[]> = new Map<Point, IFullServiceDefinition[]>()
  private points: Point[] = []
  private _getServices: ((point: Point) => any[] | undefined) | null = null

  importPlugin(plugin: IPlugin) {
    plugin.forEach(definition => this.register(definition))
  }

  register(definition: IServiceDefinition) {
    const _definition = convertToFullDefinition(definition)
    if (this.registered.has(definition.point)) {
      const instock = this.registered.get(definition.point)
      this.registered.set(definition.point, [...<[]>instock, _definition])
    } else {
      this.registered.set(definition.point, [_definition])
    }

    this.points.push(definition.point)
  }

  async resolve() {
    interface IResolvePointParams {
      point: Point
      root?: boolean
      optional?: boolean
    }

    const resolved = new Map<Point, any[]>() // point -> service/services
    const resolving = new Set()

    // recursive resolve point
    const resolvePoint = async (point: Point, root = false) => {

      const resolveService = async (definition: IFullServiceDefinition) => {
        const deps = (definition && definition.deps) || {};
        const resolvedDeps: any = {};

        for (const key in deps) {
          const registeredPoint = deps[key];
          resolvedDeps[key] = await resolvePoint(registeredPoint);
        }

        let instance =
          definition && definition.factory ? await definition.factory(resolvedDeps) : undefined;

        return instance;
      }

      const resolveServices = async (definitions: IFullServiceDefinition[]) => {
        let instances = []

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

      let definitions = this.registered.get(point)

      if (!definitions) {
        throw new NotRegistered(point);
      }

      let instances = await resolveServices(definitions)

      resolving.delete(point)
      resolved.set(point, instances)

      return instances
    }

    // resolve points serialy
    for (const point of this.points) {
      await resolvePoint(point, true)
    }

    this._getServices = (point: Point) => resolved.get(point)
  }

  getServices(point: Point) {
    if (!this._getServices) {
      throw new Unresolved();
    }
    return this._getServices(point)
  }

  getService(point: Point) {
    const mayBeServices = this.getServices(point)
    return mayBeServices && mayBeServices[0]
  }

}