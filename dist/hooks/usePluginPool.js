"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var Context_1 = __importDefault(require("../components/Context"));
exports.usePluginPool = function () {
    return react_1.useContext(Context_1.default);
};
exports.default = exports.usePluginPool;
//# sourceMappingURL=usePluginPool.js.map