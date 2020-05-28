import { Client, SubscriptionClient, ClientOptions, SubscriptionClientOptions } from 'genql-runtime'
import { QueryRequest, QueryPromiseChain, Query } from './schema'
export declare const createClient: (
  options?: ClientOptions,
) => Client<QueryRequest, QueryPromiseChain, Query, never, never, never>
export declare const everything: { __scalar: boolean }