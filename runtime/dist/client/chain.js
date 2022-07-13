"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chain = void 0;
var tslib_1 = require("tslib");
var newChain = function (path) {
    if (path === void 0) { path = []; }
    var chain = (function () { });
    chain.path = path;
    return chain;
};
var pathToRequest = function (path, executeFields) {
    var _a;
    if (path.length === 0)
        return undefined;
    var _b = tslib_1.__read(path), _c = tslib_1.__read(_b[0], 2), field = _c[0], arg = _c[1], rest = _b.slice(1);
    var nextFields = pathToRequest(rest, executeFields) || executeFields;
    return _a = {},
        _a[field] = arg
            ? nextFields && typeof nextFields !== 'boolean' && typeof nextFields !== 'number'
                ? [arg, nextFields]
                : [arg]
            : nextFields
                ? nextFields
                : 1,
        _a;
};
var wrapInProxy = function (chain, onExecute) {
    return new Proxy(chain, {
        get: function (target, prop) {
            if (typeof prop !== 'string')
                throw new Error('property is not a string');
            if (prop === 'get') {
                return function (fields, defaultValue) {
                    return onExecute(target.path.map(function (i) { return i[0]; }), pathToRequest(target.path, fields), defaultValue, {});
                };
            }
            else {
                var newPath = tslib_1.__spreadArray(tslib_1.__spreadArray([], tslib_1.__read(target.path), false), [[prop]], false);
                return wrapInProxy(newChain(newPath), onExecute);
            }
        },
        apply: function (target, _, argArray) {
            var newPath = tslib_1.__spreadArray(tslib_1.__spreadArray([], tslib_1.__read(target.path.slice(0, -1)), false), [[target.path[target.path.length - 1][0], argArray[0]]], false);
            return wrapInProxy(newChain(newPath), onExecute);
        },
    });
};
var chain = function (onExecute) {
    return wrapInProxy(newChain(), onExecute);
};
exports.chain = chain;
//# sourceMappingURL=chain.js.map