"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTypeMappedAlias = void 0;
const knownTypes = {
    Int: "number",
    Float: "number",
    String: "string",
    Boolean: "boolean",
    ID: "string",
};
function getTypeMappedAlias(type, ctx) {
    var _a;
    const map = Object.assign(Object.assign({}, knownTypes), (((_a = ctx === null || ctx === void 0 ? void 0 : ctx.config) === null || _a === void 0 ? void 0 : _a.scalarTypes) || {}));
    return (map === null || map === void 0 ? void 0 : map[type.name]) || "any";
}
exports.getTypeMappedAlias = getTypeMappedAlias;
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
//# sourceMappingURL=typeMappedAlias.js.map