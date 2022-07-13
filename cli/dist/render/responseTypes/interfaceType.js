"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.interfaceType = void 0;
const comment_1 = require("../common/comment");
const objectType_1 = require("./objectType");
function interfaceType(type, ctx) {
    if (!ctx.schema) {
        throw new Error("schema is required to render unionType");
    }
    const typeNames = ctx.schema.getPossibleTypes(type).map((t) => t.name);
    if (!typeNames.length) {
        (0, objectType_1.objectType)(type, ctx);
    }
    else {
        ctx.addCodeBlock(`${(0, comment_1.typeComment)(type)}export type ${type.name} = (${typeNames.join(" | ")}) & { __isUnion?: true }`);
    }
}
exports.interfaceType = interfaceType;
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
//# sourceMappingURL=interfaceType.js.map