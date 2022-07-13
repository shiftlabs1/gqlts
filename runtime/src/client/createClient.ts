const WebSocketNode = typeof window !== "undefined" ? null : eval('require("ws")');
import { Client as WSClient, ClientOptions as WSClientOptions, createClient as createWSClient } from "graphql-ws";
import { Observable } from "zen-observable-ts";
import { BatchOptions, createFetcher } from "../fetcher";
import { LinkedType } from "../types";
import { generateGraphqlOperation, GraphqlOperation } from "./generateGraphqlOperation";
import { chain } from './chain'
import { AxiosInstance, AxiosRequestConfig, AxiosRequestHeaders } from "axios";
import get from 'lodash.get'

export type Headers = AxiosRequestHeaders | (() => AxiosRequestHeaders) | (() => Promise<AxiosRequestHeaders>);
export type BaseFetcher = {
  fetcherMethod: (operation: GraphqlOperation | GraphqlOperation[], config?: AxiosRequestConfig) => Promise<any>;
  fetcherInstance: AxiosInstance | unknown | undefined;
};

export type ClientOptions = Omit<AxiosRequestConfig, "body" | "headers"> & {
  url?: string;
  timeout?: number;
  batch?: BatchOptions | boolean;
  fetcherMethod?: BaseFetcher["fetcherMethod"];
  fetcherInstance?: BaseFetcher["fetcherInstance"];
  headers?: Headers;
  subscription?: { url?: string; headers?: Headers } & Partial<WSClientOptions>;
};

export function createClient({
  queryRoot,
  mutationRoot,
  subscriptionRoot,
  ...options
}: ClientOptions & {
  queryRoot?: LinkedType;
  mutationRoot?: LinkedType;
  subscriptionRoot?: LinkedType;
}) {
  const { fetcherMethod, fetcherInstance } = createFetcher(options);
  const client: {
    wsClient?: WSClient;
    query?: Function;
    mutation?: Function;
    subscription?: Function;
    fetcherInstance: BaseFetcher["fetcherInstance"];
    fetcherMethod: BaseFetcher["fetcherMethod"];
    chain?: {
      query?: Function
      mutation?: Function
      subscription?: Function
  }
  } = {
    fetcherInstance,
    fetcherMethod,
  };
  if (queryRoot) {
    client.query = (request, config) => {
      if (!queryRoot) throw new Error("queryRoot argument is missing");

      return client.fetcherMethod(generateGraphqlOperation("query", queryRoot, request), config);
    };
  }
  if (mutationRoot) {
    client.mutation = (request, config) => {
      if (!mutationRoot) throw new Error("mutationRoot argument is missing");

      return client.fetcherMethod(generateGraphqlOperation("mutation", mutationRoot, request), config);
    };
  }
  if (subscriptionRoot) {
    client.subscription = (request, config) => {
      if (!subscriptionRoot) {
        throw new Error("subscriptionRoot argument is missing");
      }
      const op = generateGraphqlOperation("subscription", subscriptionRoot, request);
      if (!client.wsClient) {
        client.wsClient = getSubscriptionClient(options, config);
      }
      return new Observable((observer) =>
        client.wsClient?.subscribe(op, {
          next: (data) => observer.next(data),
          error: (err) => observer.error(err),
          complete: () => observer.complete(),
        })
      );
    };
  }

  client.chain = {
    query: chain((path, request, defaultValue,config) =>
        client?.query?.(request,config).then(mapResponse(path, defaultValue)),
    ),
    mutation: chain((path, request, defaultValue,config) =>
        client?.mutation?.(request,config).then(mapResponse(path, defaultValue)),
    ),
    subscription: chain((path, request, defaultValue,config) => {
        const obs = client?.subscription?.(request,config)
        const mapper = mapResponse(path, defaultValue)
        return Observable.from(obs).map(mapper)
    }),
}

  return client;
}
const mapResponse = (path: string[], defaultValue: any = undefined) => (
  response: any,
) => {
  const result = get(response, [...path], defaultValue)

  if (result === undefined) {
      throw new Error(`Response path \`${path.join('.')}\` is empty`)
  }

  return result
}

function getSubscriptionClient(opts: ClientOptions = {}, config?: ClientOptions): WSClient {
  const { url: httpClientUrl, subscription = {} } = opts || {};
  let { url, headers = {}, ...restOpts } = opts.subscription || {};
  // by default use the top level url
  if (!url && httpClientUrl) {
    url = httpClientUrl?.replace(/^http/, "ws");
  }

  if (!url) {
    throw new Error("Subscription client error: missing url parameter");
  }

  return createWSClient({
    ...(typeof window === "undefined" && { webSocketImpl: WebSocketNode }),
    url,
    lazy: true,
    shouldRetry: () => true,
    retryAttempts: 3,
    connectionParams: async () => {
      let headersObject = typeof headers == "function" ? await headers() : headers;
      headersObject = headersObject || {};
      return {
        headers: headersObject,
      };
    },
    ...restOpts,
    ...config,
  });
}
