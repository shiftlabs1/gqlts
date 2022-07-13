"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }







var _graphql = require('graphql');


var _support = require('./support');

 function objectType(
  type,
  ctx
) {
  const typeObj = Object.keys(type.getFields()).reduce((r, f) => {
    const field = type.getFields()[f];
    const namedType = _graphql.getNamedType.call(void 0, field.type);
    const fieldObj = { type: namedType.name };
    r[f] = fieldObj;

    const args = (field).args || [];

    if (args.length > 0) {
      fieldObj.args = args.reduce((r, a) => {
        const concreteType = a.type.toString();
        const typename = _graphql.getNamedType.call(void 0, a.type).name;
        r[a.name] = [typename];
        if (typename !== concreteType) {
          _optionalChain([r, 'access', _ => _[a.name], 'optionalAccess', _2 => _2.push, 'call', _3 => _3(concreteType)]);
        }
        return r;
      }, {});
    }

    return r;
  }, {});

  if (_graphql.isInterfaceType.call(void 0, type) && ctx.schema) {
    ctx.schema.getPossibleTypes(type).map((t) => {
      if (!_support.isEmpty.call(void 0, typeObj)) {
        typeObj[`on_${t.name}`] = { type: t.name };
      }
    });
  }

  if (!_support.isEmpty.call(void 0, typeObj)) {
    typeObj.__typename = { type: "String" };
  }

  // const scalar = Object.keys(type.getFields())
  //   .map(f => type.getFields()[f])
  //   .filter(f => isScalarType(getNamedType(f.type)) || isEnumType(getNamedType(f.type)))
  //   .map(f => f.name)

  // if (scalar.length > 0) typeObj.scalar = scalar

  return typeObj;
} exports.objectType = objectType;
