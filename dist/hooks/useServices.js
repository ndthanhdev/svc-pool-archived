"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var usePluginPool_1 = __importDefault(require("./usePluginPool"));
exports.useServices = function (point) {
    var context = usePluginPool_1.default();
    return context && context.getServices(point);
};
exports.default = exports.useServices;
//# sourceMappingURL=useServices.js.map