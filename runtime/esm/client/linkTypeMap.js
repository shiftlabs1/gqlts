import { __read, __spreadArray } from "tslib";
import assign from "lodash.assign";
export function linkTypeMap(typeMap) {
    var indexToName = assign.apply(void 0, __spreadArray([{}], __read(Object.keys(typeMap.types).map(function (k, i) {
        var _a;
        return (_a = {}, _a[i] = k, _a);
    })), false));
    // add the name value
    var intermediaryTypeMap = assign.apply(void 0, __spreadArray([{}], __read(Object.keys(typeMap.types || {}).map(function (k) {
        var _a;
        var type = typeMap.types[k];
        var fields = type || {};
        // processFields(fields, indexToName)
        return _a = {},
            _a[k] = {
                name: k,
                // type scalar properties
                scalar: Object.keys(fields).filter(function (f) {
                    var _a;
                    var _b = __read((_a = fields[f]) !== null && _a !== void 0 ? _a : [], 1), type = _b[0];
                    if (!type) {
                        return false;
                    }
                    return typeMap.scalars.includes(type);
                }),
                // fields with corresponding `type` and `args`
                fields: assign.apply(void 0, __spreadArray([{}], __read(Object.keys(fields).map(function (f) {
                    var _a;
                    var _b;
                    var _c = __read((_b = fields[f]) !== null && _b !== void 0 ? _b : [], 2), typeIndex = _c[0], args = _c[1];
                    if (!typeIndex) {
                        return {};
                    }
                    return _a = {},
                        _a[f] = {
                            // replace index with type name
                            type: indexToName[typeIndex],
                            args: assign.apply(void 0, __spreadArray([{}], __read(Object.keys(args !== null && args !== void 0 ? args : {}).map(function (k) {
                                var _a;
                                var _b;
                                if (!args || !args[k]) {
                                    return {};
                                }
                                // if argTypeString == argTypeName, argTypeString is missing, need to read it
                                var _c = __read((_b = args[k]) !== null && _b !== void 0 ? _b : [], 2), argTypeName = _c[0], argTypeString = _c[1];
                                if (!argTypeName) {
                                    return {};
                                }
                                return _a = {},
                                    _a[k] = [indexToName[argTypeName], argTypeString || indexToName[argTypeName]],
                                    _a;
                            })), false)),
                        },
                        _a;
                })), false)),
            },
            _a;
    })), false));
    var res = resolveConcreteTypes(intermediaryTypeMap);
    return res;
}
// replace typename with concrete type
export var resolveConcreteTypes = function (linkedTypeMap) {
    Object.keys(linkedTypeMap).forEach(function (typeNameFromKey) {
        var type = linkedTypeMap[typeNameFromKey];
        // type.name = typeNameFromKey
        if (!(type === null || type === void 0 ? void 0 : type.fields)) {
            return;
        }
        var fields = type.fields;
        Object.keys(fields).forEach(function (f) {
            var field = fields[f];
            if (field === null || field === void 0 ? void 0 : field.args) {
                var args_1 = field.args;
                Object.keys(args_1).forEach(function (key) {
                    var arg = args_1[key];
                    if (arg) {
                        var _a = __read(arg, 1), typeName_1 = _a[0];
                        if (typeof typeName_1 === "string") {
                            if (!linkedTypeMap[typeName_1]) {
                                linkedTypeMap[typeName_1] = { name: typeName_1 };
                            }
                            arg[0] = linkedTypeMap[typeName_1];
                        }
                    }
                });
            }
            var typeName = field === null || field === void 0 ? void 0 : field.type;
            if ((field === null || field === void 0 ? void 0 : field.type) && typeof typeName === "string") {
                if (!linkedTypeMap[typeName]) {
                    linkedTypeMap[typeName] = { name: typeName };
                }
                field.type = linkedTypeMap[typeName];
            }
        });
    });
    return linkedTypeMap;
};
//# sourceMappingURL=linkTypeMap.js.map