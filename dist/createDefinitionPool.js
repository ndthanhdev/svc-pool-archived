var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "ramda", "./exceptions/Circular", "./exceptions/NotRegistered", "./utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ramda_1 = __importDefault(require("ramda"));
    var Circular_1 = require("./exceptions/Circular");
    var NotRegistered_1 = require("./exceptions/NotRegistered");
    var utils_1 = require("./utils");
    var register = ramda_1.default.curry(function (definitions, definition) {
        var fullDefinition = utils_1.convertToFullDefinition(definition);
        var inStock = (definitions.get(definition.point) ||
            []);
        definitions.set(definition.point, __spreadArrays(inStock, [fullDefinition]));
        return definitions;
    });
    var importPlugin = ramda_1.default.reduce(register);
    var curriedImportPlugin = ramda_1.default.curry(function (definitions, plugin) {
        return importPlugin(definitions, plugin);
    });
    var importPlugins = ramda_1.default.reduce(curriedImportPlugin);
    var curriedImportPlugins = ramda_1.default.curry(function (definitions, plugins) {
        return importPlugins(definitions, plugins);
    });
    var getServices = function (resolved, point) {
        return resolved[point];
    };
    var curriedGetServices = ramda_1.default.curry(getServices);
    var resolve = function (definition) { return function () { return __awaiter(void 0, void 0, void 0, function () {
        var resolved, resolving, resolvePoint, points, _i, points_1, point, instances;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    resolved = {};
                    resolving = new Set();
                    resolvePoint = function (point, root) {
                        if (root === void 0) { root = false; }
                        return __awaiter(void 0, void 0, void 0, function () {
                            var resolveDef, resolveServices, definitions, instances;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        resolveDef = function (def) { return __awaiter(void 0, void 0, void 0, function () {
                                            var theDefinitions;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        theDefinitions = definition.get(def.point);
                                                        if (!!theDefinitions) return [3 /*break*/, 1];
                                                        if (def.optional) {
                                                            return [2 /*return*/, undefined];
                                                        }
                                                        throw new NotRegistered_1.NotRegistered(point);
                                                    case 1: return [4 /*yield*/, resolvePoint(def.point)];
                                                    case 2: return [2 /*return*/, _a.sent()];
                                                }
                                            });
                                        }); };
                                        resolveServices = function (definitions) { return __awaiter(void 0, void 0, void 0, function () {
                                            var resolveService, instances, _i, definitions_1, def, _a, _b;
                                            return __generator(this, function (_c) {
                                                switch (_c.label) {
                                                    case 0:
                                                        resolveService = function (definition) { return __awaiter(void 0, void 0, void 0, function () {
                                                            var deps, resolvedDeps, _a, _b, _i, key, registeredPoint, _c, _d, instance;
                                                            return __generator(this, function (_e) {
                                                                switch (_e.label) {
                                                                    case 0:
                                                                        deps = definition.deps;
                                                                        resolvedDeps = {};
                                                                        _a = [];
                                                                        for (_b in deps)
                                                                            _a.push(_b);
                                                                        _i = 0;
                                                                        _e.label = 1;
                                                                    case 1:
                                                                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                                                                        key = _a[_i];
                                                                        registeredPoint = deps[key];
                                                                        _c = resolvedDeps;
                                                                        _d = key;
                                                                        return [4 /*yield*/, resolveDef(registeredPoint)];
                                                                    case 2:
                                                                        _c[_d] = _e.sent();
                                                                        _e.label = 3;
                                                                    case 3:
                                                                        _i++;
                                                                        return [3 /*break*/, 1];
                                                                    case 4: return [4 /*yield*/, definition.factory(resolvedDeps)];
                                                                    case 5:
                                                                        instance = _e.sent();
                                                                        return [2 /*return*/, instance];
                                                                }
                                                            });
                                                        }); };
                                                        instances = [];
                                                        _i = 0, definitions_1 = definitions;
                                                        _c.label = 1;
                                                    case 1:
                                                        if (!(_i < definitions_1.length)) return [3 /*break*/, 4];
                                                        def = definitions_1[_i];
                                                        _b = (_a = instances).push;
                                                        return [4 /*yield*/, resolveService(def)];
                                                    case 2:
                                                        _b.apply(_a, [_c.sent()]);
                                                        _c.label = 3;
                                                    case 3:
                                                        _i++;
                                                        return [3 /*break*/, 1];
                                                    case 4: return [2 /*return*/, instances];
                                                }
                                            });
                                        }); };
                                        // if there is already a service for this point maybe this is a many point
                                        // @ts-ignore
                                        if (resolved[point] && !root) {
                                            // @ts-ignore
                                            return [2 /*return*/, resolved[point]];
                                        }
                                        // if currently resolving the same type, we have a circular dependency
                                        if (resolving.has(point)) {
                                            throw new Circular_1.CircularDependency(point);
                                        }
                                        resolving.add(point);
                                        definitions = definition.get(point);
                                        return [4 /*yield*/, resolveServices(definitions)];
                                    case 1:
                                        instances = _a.sent();
                                        resolving.delete(point);
                                        return [2 /*return*/, instances];
                                }
                            });
                        });
                    };
                    points = Array.from(definition.keys());
                    _i = 0, points_1 = points;
                    _a.label = 1;
                case 1:
                    if (!(_i < points_1.length)) return [3 /*break*/, 4];
                    point = points_1[_i];
                    return [4 /*yield*/, resolvePoint(point, true)];
                case 2:
                    instances = (_a.sent());
                    // @ts-ignore
                    resolved[point] = instances;
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, {
                        getServices: curriedGetServices(resolved),
                    }];
            }
        });
    }); }; };
    exports.createDefinitionPool = function (serviceDefinitions) {
        if (serviceDefinitions === void 0) { serviceDefinitions = new Map(); }
        var next = ramda_1.default.clone(serviceDefinitions);
        var theRegister = ramda_1.default.pipe(register(next), exports.createDefinitionPool);
        var theImportPlugin = ramda_1.default.pipe(curriedImportPlugin(next), exports.createDefinitionPool);
        var theImportPlugins = ramda_1.default.pipe(curriedImportPlugins(next), exports.createDefinitionPool);
        return {
            register: theRegister,
            importPlugin: theImportPlugin,
            importPlugins: theImportPlugins,
            resolve: resolve(next),
        };
    };
});
//# sourceMappingURL=createDefinitionPool.js.map