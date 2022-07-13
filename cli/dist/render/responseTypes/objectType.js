"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }var _graphql = require('graphql');
var _comment = require('../common/comment');

var _renderTyping = require('../common/renderTyping');
var _support = require('../common/support');

const INDENTATION = "    ";

 function objectType(type, ctx) {
  let fieldsMap = type.getFields();

  if (_optionalChain([ctx, 'access', _ => _.config, 'optionalAccess', _2 => _2.sortProperties])) {
    fieldsMap = _support.sortKeys.call(void 0, fieldsMap);
  }

  const fields = Object.keys(fieldsMap).map((fieldName) => fieldsMap[fieldName]);

  if (!ctx.schema) throw new Error("no schema provided");

  const typeNames = _graphql.isObjectType.call(void 0, type) ? [type.name] : ctx.schema.getPossibleTypes(type).map((t) => t.name);

  let fieldStrings = fields
    .map((f) => {
      return `${_comment.fieldComment.call(void 0, f)}${f.name}${_renderTyping.renderTyping.call(void 0, f.type, true, true)}`;
    })
    .concat([`__typename: ${typeNames.length > 0 ? typeNames.map((t) => `'${t}'`).join("|") : "string"}`]);
  // add indentation
  fieldStrings = fieldStrings.map((x) =>
    x
      .split("\n")
      .filter(Boolean)
      .map((l) => INDENTATION + l)
      .join("\n")
  );

  // there is no need to add extensions as in graphql the implemented type must explicitly add the fields
  // const interfaceNames = isObjectType(type)
  //     ? type.getInterfaces().map((i) => i.name)
  //     : []
  // let extensions =
  //     interfaceNames.length > 0 ? ` extends ${interfaceNames.join(',')}` : ''
  ctx.addCodeBlock(`${_comment.typeComment.call(void 0, type)}export interface ${type.name} {\n${fieldStrings.join("\n")}\n}`);
} exports.objectType = objectType;
