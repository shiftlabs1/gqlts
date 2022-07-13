"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }








var _graphql = require('graphql');
var _excludedTypes = require('../common/excludedTypes');

var _enumType = require('./enumType');
var _objectType = require('./objectType');
var _scalarType = require('./scalarType');
var _unionType = require('./unionType');
var _interfaceType = require('./interfaceType');
var _support = require('../common/support');

 function renderResponseTypes(schema, ctx) {
  let typeMap = schema.getTypeMap();
  if (_optionalChain([ctx, 'access', _ => _.config, 'optionalAccess', _2 => _2.sortProperties])) {
    typeMap = _support.sortKeys.call(void 0, typeMap);
  }
  ctx.addCodeBlock(
    _scalarType.renderScalarTypes.call(void 0, 
      ctx,
      Object.values(typeMap).filter((type) => _graphql.isScalarType.call(void 0, type))
    )
  );
  for (const name in typeMap) {
    if (_excludedTypes.excludedTypes.includes(name)) continue;

    const type = typeMap[name];

    if (_graphql.isEnumType.call(void 0, type)) _enumType.enumType.call(void 0, type, ctx);
    if (_graphql.isUnionType.call(void 0, type)) _unionType.unionType.call(void 0, type, ctx);
    if (_graphql.isObjectType.call(void 0, type)) _objectType.objectType.call(void 0, type, ctx);
    if (_graphql.isInterfaceType.call(void 0, type)) _interfaceType.interfaceType.call(void 0, type, ctx);
  }

  const aliases = [
    { type: schema.getQueryType(), name: "Query" },
    { type: schema.getMutationType(), name: "Mutation" },
    { type: schema.getSubscriptionType(), name: "Subscription" },
  ]
    .map(renderAlias)
    .filter(Boolean)
    .join("\n");
  ctx.addCodeBlock(aliases);
} exports.renderResponseTypes = renderResponseTypes;

function renderAlias({ type, name }) {
  if (type && type.name !== name) {
    return `export type ${name} = ${type.name}`;
  }
  return "";
}