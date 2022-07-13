"use strict";Object.defineProperty(exports, "__esModule", {value: true});

 function comment(comment) {
  const lines = [];

  if (comment.deprecated) {
    lines.push(`@deprecated ${comment.deprecated.replace(/\s/g, " ")}`);
  }

  if (comment.text) {
    lines.push(...comment.text.split("\n"));
  }

  return lines.length > 0
    ? lines.length === 1
      ? `\n/** ${lines[0]} */\n`
      : `\n/**\n${lines.map((l) => ` * ${l}`).join("\n")}\n */\n`
    : "";
} exports.comment = comment;

 function typeComment(type) {
  return comment({
    text: type.description,
  });
} exports.typeComment = typeComment;
 function fieldComment(field) {
  return comment({
    deprecated: field.deprecationReason,
    text: field.description,
  });
} exports.fieldComment = fieldComment;
 function argumentComment(arg) {
  return comment({
    text: arg.description,
  });
} exports.argumentComment = argumentComment;
