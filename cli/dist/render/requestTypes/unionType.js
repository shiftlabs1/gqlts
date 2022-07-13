"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unionType = void 0;
const lodash_1 = require("lodash");
const comment_1 = require("../common/comment");
const requestTypeName_1 = require("./requestTypeName");
function unionType(type, ctx) {
    var _a;
    let types = type.getTypes();
    if ((_a = ctx.config) === null || _a === void 0 ? void 0 : _a.sortProperties) {
        // todo fix in new graphql version
        // types = types.sort();
    }
    const fieldStrings = types.map((t) => `on_${t.name}?:${(0, requestTypeName_1.requestTypeName)(t)}`);
    const commonInterfaces = (0, lodash_1.uniq)((0, lodash_1.flatten)(types.map((x) => x.getInterfaces())));
    fieldStrings.push(...commonInterfaces.map((type) => {
        return `on_${type.name}?: ${(0, requestTypeName_1.requestTypeName)(type)}`;
    }));
    fieldStrings.push("__typename?: boolean | number");
    ctx.addCodeBlock(`${(0, comment_1.typeComment)(type)}export interface ${(0, requestTypeName_1.requestTypeName)(type)}{\n${fieldStrings
        .map((x) => "    " + x)
        .join(",\n")}\n}`);
}
exports.unionType = unionType;
//# sourceMappingURL=unionType.js.map