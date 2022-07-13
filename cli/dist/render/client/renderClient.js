"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }var _graphql = require('graphql');

var _config = require('../../config');
var _excludedTypes = require('../common/excludedTypes');
var _camelCase = require('lodash/camelCase'); var _camelCase2 = _interopRequireDefault(_camelCase);

const { version } = require("../../../package.json");

function renderClientCode(ctx) {
  const url = _optionalChain([ctx, 'access', _ => _.config, 'optionalAccess', _2 => _2.endpoint]) ? `"${ctx.config.endpoint}"` : "undefined";
  return `
function(options) {
    options = options || {}
    var optionsCopy = {
      url: ${url},
      queryRoot: typeMap.Query,
      mutationRoot: typeMap.Mutation,
      subscriptionRoot: typeMap.Subscription,
    }
    for (var name in options) {
      optionsCopy[name] = options[name];
    }
    return createClientOriginal(optionsCopy)
}`;
}

 function renderEnumsMaps(schema, moduleType) {
  let typeMap = schema.getTypeMap();

  const enums = [];
  for (const name in typeMap) {
    if (_excludedTypes.excludedTypes.includes(name)) continue;

    const type = typeMap[name];

    if (_graphql.isEnumType.call(void 0, type)) {
      enums.push(type);
    }
  }
  if (enums.length === 0) return "";
  const declaration = (() => {
    if (moduleType === "esm") {
      return "export const ";
    } else if (moduleType === "cjs") {
      return "module.exports.";
    } else if (moduleType === "type") {
      return "export declare const ";
    }
    return "";
  })();
  return enums
    .map(
      (type) =>
        `${declaration}${_camelCase2.default.call(void 0, "enum" + type.name)}${moduleType === "type" ? ": " : " = "}{\n` +
        type
          .getValues()
          .map((v) => {
            if (!_optionalChain([v, 'optionalAccess', _3 => _3.name])) {
              return "";
            }
            return `  ${moduleType === "type" ? "readonly " : ""}${v.name}: '${v.name}'`;
          })
          .join(",\n") +
        `\n}\n`
    )
    .join("\n");
} exports.renderEnumsMaps = renderEnumsMaps;

 function renderClientCjs(schema, ctx) {
  const prefix = _optionalChain([ctx, 'access', _4 => _4.config, 'optionalAccess', _5 => _5.methodPrefix]) || "";
  const suffix = _optionalChain([ctx, 'access', _6 => _6.config, 'optionalAccess', _7 => _7.methodSuffix]) || "";
  ctx.addCodeBlock(`
  const {
      linkTypeMap,
      createClient: createClientOriginal,
      generateGraphqlOperation,
      assertSameVersion,
  } = require('${_config.RUNTIME_LIB_NAME}')
  var typeMap = linkTypeMap(require('./types.cjs'))

  var version = '${version}'
  assertSameVersion(version)

  module.exports.version = version

  module.exports.${prefix}createClient${suffix} = ${renderClientCode(ctx)}

  ${renderEnumsMaps(schema, "cjs")}

  module.exports.generateQueryOp = function(fields) {
    return generateGraphqlOperation('query', typeMap.Query, fields)
  }
  module.exports.generateMutationOp = function(fields) {
    return generateGraphqlOperation('mutation', typeMap.Mutation, fields)
  }
  module.exports.generateSubscriptionOp = function(fields) {
    return generateGraphqlOperation('subscription', typeMap.Subscription, fields)
  }
  module.exports.everything = {
    __scalar: true
  }

  var schemaExports = require('./guards.cjs')
  for (var k in schemaExports) {
    module.exports[k] = schemaExports[k];
  }
  `);
} exports.renderClientCjs = renderClientCjs;

 function renderClientEsm(schema, ctx) {
  const prefix = _optionalChain([ctx, 'access', _8 => _8.config, 'optionalAccess', _9 => _9.methodPrefix]) || "";
  const suffix = _optionalChain([ctx, 'access', _10 => _10.config, 'optionalAccess', _11 => _11.methodSuffix]) || "";
  ctx.addCodeBlock(`
  import {
      linkTypeMap,
      createClient as createClientOriginal,
      generateGraphqlOperation,
      assertSameVersion,
  } from '${_config.RUNTIME_LIB_NAME}'
  import types from './types.esm'
  var typeMap = linkTypeMap(types)
  export * from './guards.esm'

  export var version = ${JSON.stringify(version)}
  assertSameVersion(version)

  export var ${prefix}createClient${suffix} = ${renderClientCode(ctx)}

  ${renderEnumsMaps(schema, "esm")}

  export var generateQueryOp = function(fields) {
    return generateGraphqlOperation('query', typeMap.Query, fields)
  }
  export var generateMutationOp = function(fields) {
    return generateGraphqlOperation('mutation', typeMap.Mutation, fields)
  }
  export var generateSubscriptionOp = function(fields) {
    return generateGraphqlOperation('subscription', typeMap.Subscription, fields)
  }
  export var everything = {
    __scalar: true
  }
  `);
} exports.renderClientEsm = renderClientEsm;
