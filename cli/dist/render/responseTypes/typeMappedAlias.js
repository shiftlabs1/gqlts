"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }


const knownTypes

 = {
  Int: "number",
  Float: "number",
  String: "string",
  Boolean: "boolean",
  ID: "string",
};

 function getTypeMappedAlias(type, ctx) {
  const map = { ...knownTypes, ...(_optionalChain([ctx, 'optionalAccess', _ => _.config, 'optionalAccess', _2 => _2.scalarTypes]) || {}) };
  return _optionalChain([map, 'optionalAccess', _3 => _3[type.name]]) || "any";
} exports.getTypeMappedAlias = getTypeMappedAlias;

// export const renderTypeMappedAlias = (
//     type: GraphQLNamedType,
//     ctx: RenderContext,
// ) => {
//     const mappedType = getTypeMappedAlias(type, ctx)
//     if (mappedType) {
//         ctx.addCodeBlock(
//             `${typeComment(type)}export type ${type.name} = ${mappedType}`,
//         )
//     }
// }
