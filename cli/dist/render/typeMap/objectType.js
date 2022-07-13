"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.objectType = void 0;
const graphql_1 = require("graphql");
const support_1 = require("./support");
function objectType(type, ctx) {
    const typeObj = Object.keys(type.getFields()).reduce((r, f) => {
        const field = type.getFields()[f];
        const namedType = (0, graphql_1.getNamedType)(field.type);
        const fieldObj = { type: namedType.name };
        r[f] = fieldObj;
        const args = field.args || [];
        if (args.length > 0) {
            fieldObj.args = args.reduce((r, a) => {
                var _a;
                const concreteType = a.type.toString();
                const typename = (0, graphql_1.getNamedType)(a.type).name;
                r[a.name] = [typename];
                if (typename !== concreteType) {
                    (_a = r[a.name]) === null || _a === void 0 ? void 0 : _a.push(concreteType);
                }
                return r;
            }, {});
        }
        return r;
    }, {});
    if ((0, graphql_1.isInterfaceType)(type) && ctx.schema) {
        ctx.schema.getPossibleTypes(type).map((t) => {
            if (!(0, support_1.isEmpty)(typeObj)) {
                typeObj[`on_${t.name}`] = { type: t.name };
            }
        });
    }
    if (!(0, support_1.isEmpty)(typeObj)) {
        typeObj.__typename = { type: "String" };
    }
    // const scalar = Object.keys(type.getFields())
    //   .map(f => type.getFields()[f])
    //   .filter(f => isScalarType(getNamedType(f.type)) || isEnumType(getNamedType(f.type)))
    //   .map(f => f.name)
    // if (scalar.length > 0) typeObj.scalar = scalar
    return typeObj;
}
exports.objectType = objectType;
//# sourceMappingURL=objectType.js.map