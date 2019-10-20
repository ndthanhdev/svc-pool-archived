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
    var BaseError = /** @class */ (function () {
        function BaseError(message) {
            Error.call(this, message);
        }
        return BaseError;
    }());
    exports.BaseError = BaseError;
    exports.default = BaseError;
});
//# sourceMappingURL=BaseError.js.map