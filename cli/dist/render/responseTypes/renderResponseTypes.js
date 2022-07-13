"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderResponseTypes = void 0;
const graphql_1 = require("graphql");
const excludedTypes_1 = require("../common/excludedTypes");
const enumType_1 = require("./enumType");
const objectType_1 = require("./objectType");
const scalarType_1 = require("./scalarType");
const unionType_1 = require("./unionType");
const interfaceType_1 = require("./interfaceType");
const support_1 = require("../common/support");
function renderResponseTypes(schema, ctx) {
    var _a;
    let typeMap = schema.getTypeMap();
    if ((_a = ctx.config) === null || _a === void 0 ? void 0 : _a.sortProperties) {
        typeMap = (0, support_1.sortKeys)(typeMap);
    }
    ctx.addCodeBlock((0, scalarType_1.renderScalarTypes)(ctx, Object.values(typeMap).filter((type) => (0, graphql_1.isScalarType)(type))));
    for (const name in typeMap) {
        if (excludedTypes_1.excludedTypes.includes(name))
            continue;
        const type = typeMap[name];
        if ((0, graphql_1.isEnumType)(type))
            (0, enumType_1.enumType)(type, ctx);
        if ((0, graphql_1.isUnionType)(type))
            (0, unionType_1.unionType)(type, ctx);
        if ((0, graphql_1.isObjectType)(type))
            (0, objectType_1.objectType)(type, ctx);
        if ((0, graphql_1.isInterfaceType)(type))
            (0, interfaceType_1.interfaceType)(type, ctx);
    }
    const aliases = [
        { type: schema.getQueryType(), name: "Query" },
        { type: schema.getMutationType(), name: "Mutation" },
        { type: schema.getSubscriptionType(), name: "Subscription" },
    ]
        .map(renderAlias)
        .filter(Boolean)
        .join("\n");
    ctx.addCodeBlock(aliases);
}
exports.renderResponseTypes = renderResponseTypes;
function renderAlias({ type, name }) {
    if (type && type.name !== name) {
        return `export type ${name} = ${type.name}`;
    }
    return "";
}
//# sourceMappingURL=renderResponseTypes.js.map