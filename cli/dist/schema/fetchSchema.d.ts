import fetch from "isomorphic-unfetch";
import { ExecutionResult } from "graphql";
import { GraphQLSchemaValidationOptions } from "graphql/type/schema";
import qs from "qs";
export interface SchemaFetcher {
    (query: string, fetchImpl: typeof fetch, qsImpl: typeof qs): Promise<ExecutionResult>;
}
export declare function fetchSchema({ endpoint, usePost, headers, options, }: {
    endpoint: string;
    usePost: boolean;
    headers?: Record<string, string>;
    options?: GraphQLSchemaValidationOptions;
}): Promise<import("graphql").GraphQLSchema>;
export declare function customFetchSchema(fetcher: SchemaFetcher, options?: GraphQLSchemaValidationOptions): Promise<import("graphql").GraphQLSchema>;
