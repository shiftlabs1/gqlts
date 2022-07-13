"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderTypeGuards = void 0;
const graphql_1 = require("graphql");
const excludedTypes_1 = require("../common/excludedTypes");
const renderTypeGuard = (target, possible, mode) => mode == "ts"
    ? `
const ${target}_possibleTypes: string[] = [${possible.map((t) => `'${t}'`).join(",")}]
export const is${target} = (obj?: { __typename?: any } | null): obj is ${target} => {
  if (!obj?.__typename) throw new Error('__typename is missing in "is${target}"')
  return ${target}_possibleTypes.includes(obj.__typename)
}
`
    : `
var ${target}_possibleTypes = [${possible.map((t) => `'${t}'`).join(",")}]
${mode === "esm" ? "export var " : "module.exports."}is${target} = function(obj) {
  if (!obj || !obj.__typename) throw new Error('__typename is missing in "is${target}"')
  return ${target}_possibleTypes.includes(obj.__typename)
}
`;
function renderTypeGuards(schema, ctx, isJs = "ts") {
    const typeMap = schema.getTypeMap();
    for (const name in typeMap) {
        if (excludedTypes_1.excludedTypes.includes(name))
            continue;
        const type = typeMap[name];
        if ((0, graphql_1.isUnionType)(type)) {
            const types = type.getTypes().map((t) => t.name);
            ctx.addCodeBlock(renderTypeGuard(type.name, types, isJs));
        }
        else if ((0, graphql_1.isInterfaceType)(type)) {
            const types = schema.getPossibleTypes(type).map((t) => t.name);
            ctx.addCodeBlock(renderTypeGuard(type.name, types, isJs));
        }
        else if ((0, graphql_1.isObjectType)(type)) {
            ctx.addCodeBlock(renderTypeGuard(type.name, [type.name], isJs));
        }
    }
}
exports.renderTypeGuards = renderTypeGuards;
//# sourceMappingURL=renderTypeGuards.js.map