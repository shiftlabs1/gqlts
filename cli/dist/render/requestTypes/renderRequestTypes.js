"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderRequestTypes = void 0;
const graphql_1 = require("graphql");
const excludedTypes_1 = require("../common/excludedTypes");
const inputObjectType_1 = require("./inputObjectType");
const objectType_1 = require("./objectType");
const unionType_1 = require("./unionType");
const support_1 = require("../common/support");
function renderRequestTypes(schema, ctx) {
    var _a;
    let typeMap = schema.getTypeMap();
    if ((_a = ctx.config) === null || _a === void 0 ? void 0 : _a.sortProperties) {
        typeMap = (0, support_1.sortKeys)(typeMap);
    }
    for (const name in typeMap) {
        if (excludedTypes_1.excludedTypes.includes(name))
            continue;
        const type = typeMap[name];
        if ((0, graphql_1.isObjectType)(type) || (0, graphql_1.isInterfaceType)(type))
            (0, objectType_1.objectType)(type, ctx);
        if ((0, graphql_1.isInputObjectType)(type))
            (0, inputObjectType_1.inputObjectType)(type, ctx);
        if ((0, graphql_1.isUnionType)(type))
            (0, unionType_1.unionType)(type, ctx);
    }
    const aliases = [
        { type: schema.getQueryType(), name: "QueryRequest" },
        { type: schema.getMutationType(), name: "MutationRequest" },
        { type: schema.getSubscriptionType(), name: "SubscriptionRequest" },
    ]
        .map(renderAlias)
        .filter(Boolean)
        .join("\n");
    ctx.addCodeBlock(aliases);
}
exports.renderRequestTypes = renderRequestTypes;
function renderAlias({ type, name }) {
    if (type && type.name + "Request" !== name) {
        // TODO make the camel case or kebab case an option
        return `export type ${name} = ${type.name + "Request"}`;
    }
    return "";
}
//# sourceMappingURL=renderRequestTypes.js.map