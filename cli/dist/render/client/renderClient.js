"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderClientEsm = exports.renderClientCjs = exports.renderEnumsMaps = void 0;
const graphql_1 = require("graphql");
const config_1 = require("../../config");
const excludedTypes_1 = require("../common/excludedTypes");
const camelCase_1 = __importDefault(require("lodash/camelCase"));
const { version } = require("../../../package.json");
function renderClientCode(ctx) {
    var _a;
    const url = ((_a = ctx.config) === null || _a === void 0 ? void 0 : _a.endpoint) ? `"${ctx.config.endpoint}"` : "undefined";
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
        if (excludedTypes_1.excludedTypes.includes(name))
            continue;
        const type = typeMap[name];
        if ((0, graphql_1.isEnumType)(type)) {
            enums.push(type);
        }
    }
    if (enums.length === 0)
        return "";
    const declaration = (() => {
        if (moduleType === "esm") {
            return "export const ";
        }
        else if (moduleType === "cjs") {
            return "module.exports.";
        }
        else if (moduleType === "type") {
            return "export declare const ";
        }
        return "";
    })();
    return enums
        .map((type) => `${declaration}${(0, camelCase_1.default)("enum" + type.name)}${moduleType === "type" ? ": " : " = "}{\n` +
        type
            .getValues()
            .map((v) => {
            if (!(v === null || v === void 0 ? void 0 : v.name)) {
                return "";
            }
            return `  ${moduleType === "type" ? "readonly " : ""}${v.name}: '${v.name}'`;
        })
            .join(",\n") +
        `\n}\n`)
        .join("\n");
}
exports.renderEnumsMaps = renderEnumsMaps;
function renderClientCjs(schema, ctx) {
    var _a, _b;
    const prefix = ((_a = ctx.config) === null || _a === void 0 ? void 0 : _a.methodPrefix) || "";
    const suffix = ((_b = ctx.config) === null || _b === void 0 ? void 0 : _b.methodSuffix) || "";
    ctx.addCodeBlock(`
  const {
      linkTypeMap,
      createClient: createClientOriginal,
      generateGraphqlOperation,
      assertSameVersion,
  } = require('${config_1.RUNTIME_LIB_NAME}')
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
}
exports.renderClientCjs = renderClientCjs;
function renderClientEsm(schema, ctx) {
    var _a, _b;
    const prefix = ((_a = ctx.config) === null || _a === void 0 ? void 0 : _a.methodPrefix) || "";
    const suffix = ((_b = ctx.config) === null || _b === void 0 ? void 0 : _b.methodSuffix) || "";
    ctx.addCodeBlock(`
  import {
      linkTypeMap,
      createClient as createClientOriginal,
      generateGraphqlOperation,
      assertSameVersion,
  } from '${config_1.RUNTIME_LIB_NAME}'
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
}
exports.renderClientEsm = renderClientEsm;
//# sourceMappingURL=renderClient.js.map