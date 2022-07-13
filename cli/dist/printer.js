"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }var _visitor = require('graphql/language/visitor');

var _prettify = require('./helpers/prettify');

/**
 * Converts an AST into a string, using one set of reasonable
 * formatting rules.
 */







 function print(ast, options = {}) {
  return _visitor.visit.call(void 0, ast, {
    leave: (node) => {
      const fn = printDocASTReducer(options);
      const visitor = fn[node.kind];
      if (visitor) {
        return visitor(node);
      }
      return null;
    },
  });
} exports.print = print;

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
      return _prettify.prettify.call(void 0, code, "typescript");
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
  return _nullishCoalesce(_optionalChain([maybeArray, 'optionalAccess', _ => _.filter, 'call', _2 => _2((x) => x), 'access', _3 => _3.join, 'call', _4 => _4(separator)]), () => ( ""));
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
