"use strict";Object.defineProperty(exports, "__esModule", {value: true});
var _comment = require('../common/comment');


 function enumType(type, ctx) {
  const values = type.getValues().map((v) => `'${v.name}'`);
  ctx.addCodeBlock(`${_comment.typeComment.call(void 0, type)}export type ${type.name} = ${values.join(" | ")}`);
} exports.enumType = enumType;
