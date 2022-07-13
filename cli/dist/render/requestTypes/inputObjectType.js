"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputObjectType = void 0;
const comment_1 = require("../common/comment");
const renderTyping_1 = require("../common/renderTyping");
const support_1 = require("../common/support");
function inputObjectType(type, ctx) {
    var _a;
    let fields = type.getFields();
    if ((_a = ctx.config) === null || _a === void 0 ? void 0 : _a.sortProperties) {
        fields = (0, support_1.sortKeys)(fields);
    }
    const fieldStrings = Object.keys(fields).map((fieldName) => {
        const field = fields[fieldName];
        return `${(0, comment_1.argumentComment)(field)}${field.name}${(0, renderTyping_1.renderTyping)(field.type, false, true)}`;
    });
    ctx.addCodeBlock(`${(0, comment_1.typeComment)(type)}export interface ${type.name} {${fieldStrings.join(",")}}`);
}
exports.inputObjectType = inputObjectType;
//# sourceMappingURL=inputObjectType.js.map