"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
var _comment = require('../common/comment');

var _renderTyping = require('../common/renderTyping');
var _support = require('../common/support');

 function inputObjectType(type, ctx) {
  let fields = type.getFields();

  if (_optionalChain([ctx, 'access', _ => _.config, 'optionalAccess', _2 => _2.sortProperties])) {
    fields = _support.sortKeys.call(void 0, fields);
  }

  const fieldStrings = Object.keys(fields).map((fieldName) => {
    const field = fields[fieldName];
    return `${_comment.argumentComment.call(void 0, field)}${field.name}${_renderTyping.renderTyping.call(void 0, field.type, false, true)}`;
  });

  ctx.addCodeBlock(`${_comment.typeComment.call(void 0, type)}export interface ${type.name} {${fieldStrings.join(",")}}`);
} exports.inputObjectType = inputObjectType;
