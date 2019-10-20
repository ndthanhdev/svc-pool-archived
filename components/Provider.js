"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var Context_1 = __importDefault(require("./Context"));
exports.PluginPoolContextProvider = function (_a) {
    var value = _a.value, children = _a.children;
    return (react_1.default.createElement(Context_1.default.Provider, { value: value }, children));
};
exports.default = exports.PluginPoolContextProvider;
//# sourceMappingURL=Provider.js.map