"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderClientDefinition = void 0;
const requestTypeName_1 = require("../requestTypes/requestTypeName");
const config_1 = require("../../config");
const renderClient_1 = require("./renderClient");
function renderClientDefinition(schema, ctx) {
    var _a, _b;
    const queryType = schema.getQueryType();
    const mutationType = schema.getMutationType();
    const subscriptionType = schema.getSubscriptionType();
    const prefix = ((_a = ctx.config) === null || _a === void 0 ? void 0 : _a.methodPrefix) || "";
    const suffix = ((_b = ctx.config) === null || _b === void 0 ? void 0 : _b.methodSuffix) || "";
    ctx.addCodeBlock(`
    import { FieldsSelection, GraphqlOperation, ClientOptions, Observable } from '${config_1.RUNTIME_LIB_NAME}'
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
    ctx.addCodeBlock(renderSupportFunctionsTypes({
        mutationType,
        queryType,
        subscriptionType,
    }));
    ctx.addCodeBlock((0, renderClient_1.renderEnumsMaps)(schema, "type"));
}
exports.renderClientDefinition = renderClientDefinition;
function renderClientTypesImports({ queryType, mutationType, subscriptionType }) {
    const imports = [];
    if (queryType) {
        imports.push((0, requestTypeName_1.requestTypeName)(queryType), queryType.name);
    }
    if (mutationType) {
        imports.push((0, requestTypeName_1.requestTypeName)(mutationType), mutationType.name);
    }
    if (subscriptionType) {
        imports.push((0, requestTypeName_1.requestTypeName)(subscriptionType), subscriptionType.name);
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
        query<R extends ${(0, requestTypeName_1.requestTypeName)(queryType)}>(
            request: R & { __name?: string },
            config?: RC,
        ): Promise<GraphqlResponse<FieldsSelection<${queryType.name}, R>>>
        `;
    }
    if (mutationType) {
        interfaceContent += `
        mutation<R extends ${(0, requestTypeName_1.requestTypeName)(mutationType)}>(
            request: R & { __name?: string },
            config?: RC,
        ): Promise<GraphqlResponse<FieldsSelection<${mutationType.name}, R>>>
        `;
    }
    if (subscriptionType) {
        interfaceContent += `
        subscription<R extends ${(0, requestTypeName_1.requestTypeName)(subscriptionType)}>(
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
        export type QueryResult<fields extends ${(0, requestTypeName_1.requestTypeName)(queryType)}> = GraphqlResponse<FieldsSelection<${queryType.name}, fields>>

        export declare const generateQueryOp: (fields: ${(0, requestTypeName_1.requestTypeName)(queryType)} & { __name?: string }) => GraphqlOperation`;
    }
    if (mutationType) {
        code += `
        export type MutationResult<fields extends ${(0, requestTypeName_1.requestTypeName)(mutationType)}> = GraphqlResponse<FieldsSelection<${mutationType.name}, fields>>

        export declare const generateMutationOp: (fields: ${(0, requestTypeName_1.requestTypeName)(mutationType)} & { __name?: string }) => GraphqlOperation`;
    }
    if (subscriptionType) {
        code += `
        export type SubscriptionResult<fields extends ${(0, requestTypeName_1.requestTypeName)(subscriptionType)}> = GraphqlResponse<FieldsSelection<${subscriptionType.name}, fields>>

        export declare const generateSubscriptionOp: (fields: ${(0, requestTypeName_1.requestTypeName)(subscriptionType)} & { __name?: string }) => GraphqlOperation`;
    }
    return code;
}
//# sourceMappingURL=renderClientDefinition.js.map