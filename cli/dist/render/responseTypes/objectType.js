"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.objectType = void 0;
const graphql_1 = require("graphql");
const comment_1 = require("../common/comment");
const renderTyping_1 = require("../common/renderTyping");
const support_1 = require("../common/support");
const INDENTATION = "    ";
function objectType(type, ctx) {
    var _a;
    let fieldsMap = type.getFields();
    if ((_a = ctx.config) === null || _a === void 0 ? void 0 : _a.sortProperties) {
        fieldsMap = (0, support_1.sortKeys)(fieldsMap);
    }
    const fields = Object.keys(fieldsMap).map((fieldName) => fieldsMap[fieldName]);
    if (!ctx.schema)
        throw new Error("no schema provided");
    const typeNames = (0, graphql_1.isObjectType)(type) ? [type.name] : ctx.schema.getPossibleTypes(type).map((t) => t.name);
    let fieldStrings = fields
        .map((f) => {
        return `${(0, comment_1.fieldComment)(f)}${f.name}${(0, renderTyping_1.renderTyping)(f.type, true, true)}`;
    })
        .concat([`__typename: ${typeNames.length > 0 ? typeNames.map((t) => `'${t}'`).join("|") : "string"}`]);
    // add indentation
    fieldStrings = fieldStrings.map((x) => x
        .split("\n")
        .filter(Boolean)
        .map((l) => INDENTATION + l)
        .join("\n"));
    // there is no need to add extensions as in graphql the implemented type must explicitly add the fields
    // const interfaceNames = isObjectType(type)
    //     ? type.getInterfaces().map((i) => i.name)
    //     : []
    // let extensions =
    //     interfaceNames.length > 0 ? ` extends ${interfaceNames.join(',')}` : ''
    ctx.addCodeBlock(`${(0, comment_1.typeComment)(type)}export interface ${type.name} {\n${fieldStrings.join("\n")}\n}`);
}
exports.objectType = objectType;
//# sourceMappingURL=objectType.js.map