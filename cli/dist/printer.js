"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.print = void 0;
const visitor_1 = require("graphql/language/visitor");
const prettify_1 = require("./helpers/prettify");
function print(ast, options = {}) {
    return (0, visitor_1.visit)(ast, {
        leave: (node) => {
            const fn = printDocASTReducer(options);
            const visitor = fn[node.kind];
            if (visitor) {
                return visitor(node);
            }
            return null;
        },
    });
}
exports.print = print;
function printDocASTReducer({ clientVarName = "client", transformVariableName = (x) => x, thenCode }) {
    return {
        Name: (node) => node.value,
        Variable: (node) => transformVariableName(node.name),
        NamedType: ({ name }) => name,
        ListType: ({ type }) => "[" + type + "]",
        NonNullType: ({ type }) => type,
        Directive: ({ name, arguments: args }) => "",
        IntValue: ({ value }) => value,
        FloatValue: ({ value }) => value,
        StringValue: ({ value, block: isBlockString }, key) => JSON.stringify(value),
        BooleanValue: ({ value }) => (value ? "true" : "false"),
        NullValue: () => "null",
        EnumValue: ({ value }) => `'${value}'`,
        ListValue: ({ values }) => "[" + join(values, ", ") + "]",
        ObjectValue: ({ fields }) => "{" + join(fields, ", ") + "}",
        ObjectField: ({ name, value }) => name + ": " + value,
        // Document
        Document: (node) => join(node.definitions, "\n\n") + "\n",
        OperationDefinition(node) {
            const selectionSet = node.selectionSet;
            // Anonymous queries with no directives or variable definitions can use
            // the query short form.
            let code = join(node.variableDefinitions, "\n");
            if (node.variableDefinitions.length) {
                code = "// variables\n" + code;
                code += "\n\n";
            }
            code += `${clientVarName}.${node.operation}(` + selectionSet + ")";
            if (thenCode) {
                code += `.then(${thenCode})`;
            }
            return (0, prettify_1.prettify)(code, "typescript");
        },
        VariableDefinition: ({ variable, type, defaultValue, directives }) => {
            return "var " + variable.replace("$", "");
        },
        SelectionSet: ({ selections }) => block(selections),
        Field: ({ alias, name, arguments: args, directives, selectionSet }) => {
            if (args.length == 0 && !join([selectionSet])) {
                return name + ": true";
            }
            if (args.length == 0) {
                return name + ": " + join([selectionSet]);
            }
            const argsAndFields = join([block(args), ",", selectionSet]);
            return name + ": " + wrap("[", argsAndFields, "]");
        },
        // join(directives, ' '),
        Argument: ({ name, value = "" }) => {
            if (typeof value === "string") {
                return name + ": " + transformVariableName(value.replace("$", ""));
            }
            console.error(`unhandled type, received ${JSON.stringify(value)} as Argument`);
            return "";
        },
        // Fragments
        FragmentSpread: ({ name, directives }) => {
            // TODO FragmentSpread
            return "..." + name + ",";
        },
        InlineFragment: ({ typeCondition, directives, selectionSet }) => {
            console.log({ selectionSet, directives, typeCondition });
            return join(["", wrap("on_", typeCondition), ":", selectionSet], " ");
        },
        FragmentDefinition: ({ name, typeCondition, variableDefinitions, directives, selectionSet }) => {
            // TODO FragmentDefinition
            // Note: fragment variable definitions are experimental and may be changed
            // or removed in the future.
            return `const ${name} = ` + selectionSet;
        },
        // Directive
    };
}
/**
 * Given maybeArray, print an empty string if it is null or empty, otherwise
 * print all items together separated by separator if provided
 */
function join(maybeArray, separator = "") {
    var _a;
    return (_a = maybeArray === null || maybeArray === void 0 ? void 0 : maybeArray.filter((x) => x).join(separator)) !== null && _a !== void 0 ? _a : "";
}
/**
 * Given array, print each item on its own line, wrapped in an
 * indented "{ }" block.
 */
function block(array) {
    return array && array.length !== 0 ? "{\n" + indent(join(array, ",\n")) + "\n}" : "";
}
/**
 * If maybeString is not null or empty, then wrap with start and end, otherwise
 * print an empty string.
 */
function wrap(start, maybeString, end = "") {
    return maybeString ? start + maybeString + end : "";
}
function indent(maybeString) {
    return maybeString && "  " + maybeString.replace(/\n/g, "\n  ");
}
function isMultiline(string) {
    return string.indexOf("\n") !== -1;
}
function hasMultilineItems(maybeArray) {
    return maybeArray && maybeArray.some(isMultiline);
}
//# sourceMappingURL=printer.js.map