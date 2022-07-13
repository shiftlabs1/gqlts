"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.objectType = void 0;
const graphql_1 = require("graphql");
const comment_1 = require("../common/comment");
const toArgsString_1 = require("../common/toArgsString");
const requestTypeName_1 = require("./requestTypeName");
const support_1 = require("../common/support");
const INDENTATION = "    ";
function objectType(type, ctx) {
    var _a, _b;
    let fields = type.getFields();
    if ((_a = ctx.config) === null || _a === void 0 ? void 0 : _a.sortProperties) {
        fields = (0, support_1.sortKeys)(fields);
    }
    let fieldStrings = Object.keys(fields).map((fieldName) => {
        const field = fields[fieldName];
        const types = [];
        const resolvedType = (0, graphql_1.getNamedType)(field.type);
        const resolvable = !((0, graphql_1.isEnumType)(resolvedType) || (0, graphql_1.isScalarType)(resolvedType));
        const argsPresent = field.args.length > 0;
        const argsString = (0, toArgsString_1.toArgsString)(field);
        const argsOptional = !argsString.match(/[^?]:/);
        if (argsPresent) {
            if (resolvable) {
                types.push(`[${argsString},${(0, requestTypeName_1.requestTypeName)(resolvedType)}]`);
            }
            else {
                types.push(`[${argsString}]`);
            }
        }
        if (!argsPresent || argsOptional) {
            if (resolvable) {
                types.push(`${(0, requestTypeName_1.requestTypeName)(resolvedType)}`);
            }
            else {
                types.push("boolean | number");
            }
        }
        return `${(0, comment_1.fieldComment)(field)}${field.name}?: ${types.join(" | ")}`;
    });
    if ((0, graphql_1.isInterfaceType)(type) && ctx.schema) {
        let interfaceProperties = ctx.schema.getPossibleTypes(type).map((t) => `on_${t.name}?: ${(0, requestTypeName_1.requestTypeName)(t)}`);
        if ((_b = ctx.config) === null || _b === void 0 ? void 0 : _b.sortProperties) {
            interfaceProperties = interfaceProperties.sort();
        }
        fieldStrings = fieldStrings.concat(interfaceProperties);
    }
    fieldStrings.push("__typename?: boolean | number");
    fieldStrings.push("__scalar?: boolean | number");
    // add indentation
    fieldStrings = fieldStrings.map((x) => x
        .split("\n")
        .filter(Boolean)
        .map((l) => INDENTATION + l)
        .join("\n"));
    ctx.addCodeBlock(`${(0, comment_1.typeComment)(type)}export interface ${(0, requestTypeName_1.requestTypeName)(type)}{\n${fieldStrings.join("\n")}\n}`);
}
exports.objectType = objectType;
//# sourceMappingURL=objectType.js.map