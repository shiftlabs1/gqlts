"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }






var _graphql = require('graphql');
var _comment = require('../common/comment');

var _toArgsString = require('../common/toArgsString');
var _requestTypeName = require('./requestTypeName');
var _support = require('../common/support');

const INDENTATION = "    ";

 function objectType(type, ctx) {
  let fields = type.getFields();

  if (_optionalChain([ctx, 'access', _ => _.config, 'optionalAccess', _2 => _2.sortProperties])) {
    fields = _support.sortKeys.call(void 0, fields);
  }

  let fieldStrings = Object.keys(fields).map((fieldName) => {
    const field = fields[fieldName];

    const types = [];
    const resolvedType = _graphql.getNamedType.call(void 0, field.type);
    const resolvable = !(_graphql.isEnumType.call(void 0, resolvedType) || _graphql.isScalarType.call(void 0, resolvedType));
    const argsPresent = field.args.length > 0;
    const argsString = _toArgsString.toArgsString.call(void 0, field);
    const argsOptional = !argsString.match(/[^?]:/);

    if (argsPresent) {
      if (resolvable) {
        types.push(`[${argsString},${_requestTypeName.requestTypeName.call(void 0, resolvedType)}]`);
      } else {
        types.push(`[${argsString}]`);
      }
    }

    if (!argsPresent || argsOptional) {
      if (resolvable) {
        types.push(`${_requestTypeName.requestTypeName.call(void 0, resolvedType)}`);
      } else {
        types.push("boolean | number");
      }
    }

    return `${_comment.fieldComment.call(void 0, field)}${field.name}?: ${types.join(" | ")}`;
  });

  if (_graphql.isInterfaceType.call(void 0, type) && ctx.schema) {
    let interfaceProperties = ctx.schema.getPossibleTypes(type).map((t) => `on_${t.name}?: ${_requestTypeName.requestTypeName.call(void 0, t)}`);
    if (_optionalChain([ctx, 'access', _3 => _3.config, 'optionalAccess', _4 => _4.sortProperties])) {
      interfaceProperties = interfaceProperties.sort();
    }
    fieldStrings = fieldStrings.concat(interfaceProperties);
  }

  fieldStrings.push("__typename?: boolean | number");
  fieldStrings.push("__scalar?: boolean | number");

  // add indentation
  fieldStrings = fieldStrings.map((x) =>
    x
      .split("\n")
      .filter(Boolean)
      .map((l) => INDENTATION + l)
      .join("\n")
  );

  ctx.addCodeBlock(`${_comment.typeComment.call(void 0, type)}export interface ${_requestTypeName.requestTypeName.call(void 0, type)}{\n${fieldStrings.join("\n")}\n}`);
} exports.objectType = objectType;
