"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }

var _requestTypeName = require('../requestTypes/requestTypeName');
var _config = require('../../config');
var _renderClient = require('./renderClient');

 function renderClientDefinition(schema, ctx) {
  const queryType = schema.getQueryType();
  const mutationType = schema.getMutationType();
  const subscriptionType = schema.getSubscriptionType();
  const prefix = _optionalChain([ctx, 'access', _ => _.config, 'optionalAccess', _2 => _2.methodPrefix]) || "";
  const suffix = _optionalChain([ctx, 'access', _3 => _3.config, 'optionalAccess', _4 => _4.methodSuffix]) || "";

  ctx.addCodeBlock(`
    import { FieldsSelection, GraphqlOperation, ClientOptions, Observable } from '${_config.RUNTIME_LIB_NAME}'
    import { Client as WSClient } from "graphql-ws"
    import { AxiosRequestConfig, AxiosInstance } from 'axios'
    export * from './schema'
    ${renderClientTypesImports({ mutationType, queryType, subscriptionType })}
    export declare const ${prefix}createClient${suffix}:(options?: ClientOptions) => Client
    export declare const everything: { __scalar: boolean }
    export declare const version: string
  `);

  // Client interface
  ctx.addCodeBlock(renderClientType({ mutationType, queryType, subscriptionType }));

  // generateQueryOp and QueryResult types
  ctx.addCodeBlock(
    renderSupportFunctionsTypes({
      mutationType,
      queryType,
      subscriptionType,
    })
  );

  ctx.addCodeBlock(_renderClient.renderEnumsMaps.call(void 0, schema, "type"));
} exports.renderClientDefinition = renderClientDefinition;

function renderClientTypesImports({ queryType, mutationType, subscriptionType }) {
  const imports = [];
  if (queryType) {
    imports.push(_requestTypeName.requestTypeName.call(void 0, queryType), queryType.name);
  }

  if (mutationType) {
    imports.push(_requestTypeName.requestTypeName.call(void 0, mutationType), mutationType.name);
  }
  if (subscriptionType) {
    imports.push(_requestTypeName.requestTypeName.call(void 0, subscriptionType), subscriptionType.name);
  }
  if (imports.length > 0) {
    return `import {${imports.join(",")}} from './schema'`;
  }
  return "";
}

function renderClientType({ queryType, mutationType, subscriptionType }) {
  let interfaceContent = "";

  if (queryType) {
    interfaceContent += `
        query<R extends ${_requestTypeName.requestTypeName.call(void 0, queryType)}>(
            request: R & { __name?: string },
            config?: RC,
        ): Promise<GraphqlResponse<FieldsSelection<${queryType.name}, R>>>
        `;
  }

  if (mutationType) {
    interfaceContent += `
        mutation<R extends ${_requestTypeName.requestTypeName.call(void 0, mutationType)}>(
            request: R & { __name?: string },
            config?: RC,
        ): Promise<GraphqlResponse<FieldsSelection<${mutationType.name}, R>>>
        `;
  }

  if (subscriptionType) {
    interfaceContent += `
        subscription<R extends ${_requestTypeName.requestTypeName.call(void 0, subscriptionType)}>(
            request: R & { __name?: string },
        ): Observable<GraphqlResponse<FieldsSelection<${subscriptionType.name}, R>>>
        `;
  }

  return `
    export type Head<T extends unknown | unknown[]> = T extends [infer H, ...unknown[]] ? H : never
    export interface GraphQLError {
        message: string
        code?: string
        locations?: {
            line: number
            column: number
        }[]
        path?: string | number[]
        extensions?: {
          [key: string]: unknown
        }
        [key: string]: unknown
    }

    export interface Extensions {
        [key: string]: unknown
    }

    export interface GraphqlResponse<D = any, E = GraphQLError[], X = Extensions> {
      data?: D;
      errors?: E;
      extensions?: X;
    }

    export interface Client<FI =AxiosInstance, RC =AxiosRequestConfig> {
        wsClient?: WSClient
        fetcherInstance?: FI | undefined
        fetcherMethod: (operation: GraphqlOperation | GraphqlOperation[], config?: RC) => Promise<any>
        ${interfaceContent}
    }
    `;
}

// TODO add the close method that closes the ws client

function renderSupportFunctionsTypes({ queryType, mutationType, subscriptionType }) {
  let code = "";
  if (queryType) {
    code += `
        export type QueryResult<fields extends ${_requestTypeName.requestTypeName.call(void 0, queryType)}> = GraphqlResponse<FieldsSelection<${
      queryType.name
    }, fields>>

        export declare const generateQueryOp: (fields: ${_requestTypeName.requestTypeName.call(void 0, 
          queryType
        )} & { __name?: string }) => GraphqlOperation`;
  }
  if (mutationType) {
    code += `
        export type MutationResult<fields extends ${_requestTypeName.requestTypeName.call(void 0, mutationType)}> = GraphqlResponse<FieldsSelection<${
      mutationType.name
    }, fields>>

        export declare const generateMutationOp: (fields: ${_requestTypeName.requestTypeName.call(void 0, 
          mutationType
        )} & { __name?: string }) => GraphqlOperation`;
  }
  if (subscriptionType) {
    code += `
        export type SubscriptionResult<fields extends ${_requestTypeName.requestTypeName.call(void 0, 
          subscriptionType
        )}> = GraphqlResponse<FieldsSelection<${subscriptionType.name}, fields>>

        export declare const generateSubscriptionOp: (fields: ${_requestTypeName.requestTypeName.call(void 0, 
          subscriptionType
        )} & { __name?: string }) => GraphqlOperation`;
  }

  return code;
}
