"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toArgsString = void 0;
const comment_1 = require("./comment");
const renderTyping_1 = require("./renderTyping");
function toArgsString(field) {
    return `{${field.args.map((a) => `${(0, comment_1.argumentComment)(a)}${a.name}${(0, renderTyping_1.renderTyping)(a.type, false, true)}`).join(",")}}`;
}
exports.toArgsString = toArgsString;
//# sourceMappingURL=toArgsString.js.map