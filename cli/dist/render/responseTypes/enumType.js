"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enumType = void 0;
const comment_1 = require("../common/comment");
function enumType(type, ctx) {
    const values = type.getValues().map((v) => `'${v.name}'`);
    ctx.addCodeBlock(`${(0, comment_1.typeComment)(type)}export type ${type.name} = ${values.join(" | ")}`);
}
exports.enumType = enumType;
//# sourceMappingURL=enumType.js.map