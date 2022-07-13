"use strict";Object.defineProperty(exports, "__esModule", {value: true});
var _comment = require('./comment');
var _renderTyping = require('./renderTyping');

 function toArgsString(field) {
  return `{${field.args.map((a) => `${_comment.argumentComment.call(void 0, a)}${a.name}${_renderTyping.renderTyping.call(void 0, a.type, false, true)}`).join(",")}}`;
} exports.toArgsString = toArgsString;
