"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _comment = require('../common/comment');
var _objectType = require('./objectType');

 function interfaceType(type, ctx) {
  if (!ctx.schema) {
    throw new Error("schema is required to render unionType");
  }
  const typeNames = ctx.schema.getPossibleTypes(type).map((t) => t.name);
  if (!typeNames.length) {
    _objectType.objectType.call(void 0, type, ctx);
  } else {
    ctx.addCodeBlock(
      `${_comment.typeComment.call(void 0, type)}export type ${type.name} = (${typeNames.join(" | ")}) & { __isUnion?: true }`
    );
  }
} exports.interfaceType = interfaceType;

// interface should produce an object like
// export type Nameable = {
// 	__interface:{
// 			name:string
// 	};
// 	__resolve:{
// 		['on_Card']: Card;
// 		['on_CardStack']: CardStack;
// 	}
// }

// export const interfaceType = (type: GraphQLInterfaceType, ctx: RenderContext) => {
//     if (!ctx.schema) {
//         throw new Error('schema is req  required to render unionType ')
//     }
//     const typeNames = ctx.schema.getPossibleTypes(type).map((t) => t.name)
//     let resolveContent = typeNames
//         .map((name) => `on_${name}?: ${name}`)
//         .join('\n    ')

//     ctx.addCodeBlock(
//         `${typeComment(type)}export type ${type.name}={
//   __interface:
//     ${typeNames.join('|')}
//   __resolve: {
//     ${resolveContent}
//   }
//   __typename?: string
// }`,
//     )
// }
