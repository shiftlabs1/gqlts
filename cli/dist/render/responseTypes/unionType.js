"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unionType = void 0;
const comment_1 = require("../common/comment");
// union should produce an object like
// export type ChangeCard = {
// 	__union:SpecialCard | EffectCard;
// 	__resolve:{
// 		['...on SpecialCard']: SpecialCard;
// 		['...on EffectCard']: EffectCard;
// 	}
// }
function unionType(type, ctx) {
    var _a;
    let typeNames = type.getTypes().map((t) => t.name);
    if ((_a = ctx.config) === null || _a === void 0 ? void 0 : _a.sortProperties) {
        typeNames = typeNames.sort();
    }
    ctx.addCodeBlock(`${(0, comment_1.typeComment)(type)}export type ${type.name} = (${typeNames.join(" | ")}) & { __isUnion?: true }`);
}
exports.unionType = unionType;
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
//# sourceMappingURL=unionType.js.map