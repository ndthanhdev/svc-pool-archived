(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function isFullDefinition(definition) {
        return (definition instanceof Object &&
            definition.optional !== undefined);
    }
    exports.isFullDefinition = isFullDefinition;
    function convertToFullDefinition(_a) {
        var _b = _a.deps, deps = _b === void 0 ? {} : _b, point = _a.point, factory = _a.factory;
        var re = {
            point: point,
            factory: factory,
            deps: {},
        };
        re.deps = Object.keys(deps).reduce(function (acc, k) {
            var depDef = deps[k];
            if (isFullDefinition(depDef)) {
                acc[k] = Object.assign({}, depDef);
            }
            else {
                acc[k] = {
                    point: depDef,
                    optional: false,
                };
            }
            return acc;
        }, {});
        return re;
    }
    exports.convertToFullDefinition = convertToFullDefinition;
});
//# sourceMappingURL=utils.js.map