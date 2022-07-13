"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
var _lodash = require('lodash');
var _comment = require('../common/comment');

var _requestTypeName = require('./requestTypeName');

 function unionType(type, ctx) {
  let types = type.getTypes();
  if (_optionalChain([ctx, 'access', _ => _.config, 'optionalAccess', _2 => _2.sortProperties])) {
    // todo fix in new graphql version
    // types = types.sort();
  }
  const fieldStrings = types.map((t) => `on_${t.name}?:${_requestTypeName.requestTypeName.call(void 0, t)}`);

  const commonInterfaces = _lodash.uniq.call(void 0, _lodash.flatten.call(void 0, types.map((x) => x.getInterfaces())));
  fieldStrings.push(
    ...commonInterfaces.map((type) => {
      return `on_${type.name}?: ${_requestTypeName.requestTypeName.call(void 0, type)}`;
    })
  );

  fieldStrings.push("__typename?: boolean | number");

  ctx.addCodeBlock(
    `${_comment.typeComment.call(void 0, type)}export interface ${_requestTypeName.requestTypeName.call(void 0, type)}{\n${fieldStrings
      .map((x) => "    " + x)
      .join(",\n")}\n}`
  );
} exports.unionType = unionType;
