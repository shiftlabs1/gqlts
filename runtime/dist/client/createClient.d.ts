import { Client as WSClient, ClientOptions as WSClientOptions } from "graphql-ws";
import { BatchOptions } from "../fetcher";
import { LinkedType } from "../types";
import { GraphqlOperation } from "./generateGraphqlOperation";
import { AxiosInstance, AxiosRequestConfig, AxiosRequestHeaders } from "axios";
export declare type Headers = AxiosRequestHeaders | (() => AxiosRequestHeaders) | (() => Promise<AxiosRequestHeaders>);
export declare type BaseFetcher = {
    fetcherMethod: (operation: GraphqlOperation | GraphqlOperation[], config?: AxiosRequestConfig) => Promise<any>;
    fetcherInstance: AxiosInstance | unknown | undefined;
};
export declare type ClientOptions = Omit<AxiosRequestConfig, "body" | "headers"> & {
    url?: string;
    timeout?: number;
    batch?: BatchOptions | boolean;
    fetcherMethod?: BaseFetcher["fetcherMethod"];
    fetcherInstance?: BaseFetcher["fetcherInstance"];
    headers?: Headers;
    subscription?: {
        url?: string;
        headers?: Headers;
    } & Partial<WSClientOptions>;
};
export declare function createClient({ queryRoot, mutationRoot, subscriptionRoot, ...options }: ClientOptions & {
    queryRoot?: LinkedType;
    mutationRoot?: LinkedType;
    subscriptionRoot?: LinkedType;
}): {
    wsClient?: WSClient;
    query?: Function;
    mutation?: Function;
    subscription?: Function;
    fetcherInstance: BaseFetcher["fetcherInstance"];
    fetcherMethod: BaseFetcher["fetcherMethod"];
    chain?: {
        query?: Function;
        mutation?: Function;
        subscription?: Function;
    };
};
//# sourceMappingURL=createClient.d.ts.map