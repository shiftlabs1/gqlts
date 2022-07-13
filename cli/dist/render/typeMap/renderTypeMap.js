"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }








var _graphql = require('graphql');
var _excludedTypes = require('../common/excludedTypes');

var _objectType = require('./objectType');
var _unionType = require('./unionType');

 function renderTypeMap(schema, ctx) {
  // remove fields key,
  // remove the Type.type and Type.args, replace with [type, args]
  // reverse args.{name}
  // Args type is deduced and added only when the concrete type is different from type name, remove the scalar field and replace with a top level scalars array field.
  const result = {
    scalars: [],
    types: {},
  };

  Object.keys(schema.getTypeMap())
    .filter((t) => !_excludedTypes.excludedTypes.includes(t))
    .map((t) => schema.getTypeMap()[t])
    .map((t) => {
      if (_graphql.isObjectType.call(void 0, t) || _graphql.isInterfaceType.call(void 0, t) || _graphql.isInputObjectType.call(void 0, t)) result.types[t.name] = _objectType.objectType.call(void 0, t, ctx);
      else if (_graphql.isUnionType.call(void 0, t)) result.types[t.name] = _unionType.unionType.call(void 0, t, ctx);
      else if (_graphql.isScalarType.call(void 0, t) || _graphql.isEnumType.call(void 0, t)) {
        result.scalars.push(t.name);
        result.types[t.name] = {};
      }
    });

  // change names of query, mutation on schemas that chose different names (hasura)
  const q = schema.getQueryType();
  if (_optionalChain([q, 'optionalAccess', _ => _.name]) && _optionalChain([q, 'optionalAccess', _2 => _2.name]) !== "Query") {
    delete result.types[q.name];
    result.types.Query = _objectType.objectType.call(void 0, q, ctx);
    // result.Query.name = 'Query'
  }

  const m = schema.getMutationType();
  if (_optionalChain([m, 'optionalAccess', _3 => _3.name]) && m.name !== "Mutation") {
    delete result.types[m.name];
    result.types.Mutation = _objectType.objectType.call(void 0, m, ctx);
    // result.Mutation.name = 'Mutation'
  }

  const s = schema.getSubscriptionType();
  if (_optionalChain([s, 'optionalAccess', _4 => _4.name]) && s.name !== "Subscription") {
    delete result.types[s.name];
    result.types.Subscription = _objectType.objectType.call(void 0, s, ctx);
    // result.Subscription.name = 'Subscription'
  }

  ctx.addCodeBlock(JSON.stringify(replaceTypeNamesWithIndexes(result), null, 4));
} exports.renderTypeMap = renderTypeMap;

 function replaceTypeNamesWithIndexes(typeMap) {
  const nameToIndex = Object.assign(
    {},
    ...Object.keys(typeMap.types).map((k, i) => ({ [k]: i }))
  );
  const scalars = typeMap.scalars.map((x) => nameToIndex[x]);
  const types = Object.assign(
    {},
    ...Object.keys(typeMap.types || {}).map((k) => {
      const type = typeMap.types[k];
      const fieldsMap = type || {};
      // processFields(fields, indexToName)
      const fields = Object.assign(
        {},
        ...Object.keys(fieldsMap).map((f) => {
          const content = fieldsMap[f] ;
          if (!content) {
            throw new Error("no content in field " + f);
          }
          const [typeName, args] = [content.type, content.args];
          const res = [typeName ? nameToIndex[typeName] : -1];
          if (args) {
            res[1] = Object.assign(
              {},
              ...Object.keys(args || {}).map((k) => {
                const arg = _optionalChain([args, 'optionalAccess', _5 => _5[k]]);
                if (!arg) {
                  throw new Error("replaceTypeNamesWithIndexes: no arg for " + k);
                }
                return {
                  [k]: [nameToIndex[arg[0]], ...arg.slice(1)],
                } ;
              })
            );
          }

          return {
            [f]: res,
          };
        })
      );
      return {
        [k]: {
          ...fields,
        },
      };
    })
  );
  return {
    scalars,
    types,
  };
} exports.replaceTypeNamesWithIndexes = replaceTypeNamesWithIndexes;
