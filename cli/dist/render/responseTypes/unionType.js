"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }

var _comment = require('../common/comment');

// union should produce an object like
// export type ChangeCard = {
// 	__union:SpecialCard | EffectCard;
// 	__resolve:{
// 		['...on SpecialCard']: SpecialCard;
// 		['...on EffectCard']: EffectCard;
// 	}
// }

 function unionType(type, ctx) {
  let typeNames = type.getTypes().map((t) => t.name);
  if (_optionalChain([ctx, 'access', _ => _.config, 'optionalAccess', _2 => _2.sortProperties])) {
    typeNames = typeNames.sort();
  }
  ctx.addCodeBlock(`${_comment.typeComment.call(void 0, type)}export type ${type.name} = (${typeNames.join(" | ")}) & { __isUnion?: true }`);
} exports.unionType = unionType;

// export const unionType = (type: GraphQLUnionType, ctx: RenderContext) => {
//     const typeNames = type.getTypes().map((t) => t.name)
//     let resolveContent = typeNames
//         .map((name) => `on_${name}?: ${name}`)
//         .join('\n    ')

//     ctx.addCodeBlock(
//         `${typeComment(type)}export type ${type.name}={
//   __union:
//     ${typeNames.join('|')}
//   __resolve: {
//     ${resolveContent}
//   }
//   __typename?: string
// }`,
//     )
// }
