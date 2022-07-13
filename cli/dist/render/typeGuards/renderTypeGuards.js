"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _graphql = require('graphql');
var _excludedTypes = require('../common/excludedTypes');


const renderTypeGuard = (target, possible, mode) =>
  mode == "ts"
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
    if (_excludedTypes.excludedTypes.includes(name)) continue;

    const type = typeMap[name];

    if (_graphql.isUnionType.call(void 0, type)) {
      const types = type.getTypes().map((t) => t.name);
      ctx.addCodeBlock(renderTypeGuard(type.name, types, isJs));
    } else if (_graphql.isInterfaceType.call(void 0, type)) {
      const types = schema.getPossibleTypes(type).map((t) => t.name);
      ctx.addCodeBlock(renderTypeGuard(type.name, types, isJs));
    } else if (_graphql.isObjectType.call(void 0, type)) {
      ctx.addCodeBlock(renderTypeGuard(type.name, [type.name], isJs));
    }
  }
} exports.renderTypeGuards = renderTypeGuards;
