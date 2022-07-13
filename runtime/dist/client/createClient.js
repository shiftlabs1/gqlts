"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }const WebSocketNode = typeof window !== "undefined" ? null : eval('require("ws")');
var _graphqlws = require('graphql-ws');
var _zenobservablets = require('zen-observable-ts');
var _fetcher = require('../fetcher');

var _generateGraphqlOperation = require('./generateGraphqlOperation');
var _chain = require('./chain');

var _lodashget = require('lodash.get'); var _lodashget2 = _interopRequireDefault(_lodashget);

















 function createClient({
  queryRoot,
  mutationRoot,
  subscriptionRoot,
  ...options
}



) {
  const { fetcherMethod, fetcherInstance } = _fetcher.createFetcher.call(void 0, options);
  const client











 = {
    fetcherInstance,
    fetcherMethod,
  };
  if (queryRoot) {
    client.query = (request, config) => {
      if (!queryRoot) throw new Error("queryRoot argument is missing");

      return client.fetcherMethod(_generateGraphqlOperation.generateGraphqlOperation.call(void 0, "query", queryRoot, request), config);
    };
  }
  if (mutationRoot) {
    client.mutation = (request, config) => {
      if (!mutationRoot) throw new Error("mutationRoot argument is missing");

      return client.fetcherMethod(_generateGraphqlOperation.generateGraphqlOperation.call(void 0, "mutation", mutationRoot, request), config);
    };
  }
  if (subscriptionRoot) {
    client.subscription = (request, config) => {
      if (!subscriptionRoot) {
        throw new Error("subscriptionRoot argument is missing");
      }
      const op = _generateGraphqlOperation.generateGraphqlOperation.call(void 0, "subscription", subscriptionRoot, request);
      if (!client.wsClient) {
        client.wsClient = getSubscriptionClient(options, config);
      }
      return new (0, _zenobservablets.Observable)((observer) =>
        _optionalChain([client, 'access', _ => _.wsClient, 'optionalAccess', _2 => _2.subscribe, 'call', _3 => _3(op, {
          next: (data) => observer.next(data),
          error: (err) => observer.error(err),
          complete: () => observer.complete(),
        })])
      );
    };
  }

  client.chain = {
    query: _chain.chain.call(void 0, (path, request, defaultValue,config) =>
        _optionalChain([client, 'optionalAccess', _4 => _4.query, 'optionalCall', _5 => _5(request,config), 'access', _6 => _6.then, 'call', _7 => _7(mapResponse(path, defaultValue))]),
    ),
    mutation: _chain.chain.call(void 0, (path, request, defaultValue,config) =>
        _optionalChain([client, 'optionalAccess', _8 => _8.mutation, 'optionalCall', _9 => _9(request,config), 'access', _10 => _10.then, 'call', _11 => _11(mapResponse(path, defaultValue))]),
    ),
    subscription: _chain.chain.call(void 0, (path, request, defaultValue,config) => {
        const obs = _optionalChain([client, 'optionalAccess', _12 => _12.subscription, 'optionalCall', _13 => _13(request,config)])
        const mapper = mapResponse(path, defaultValue)
        return _zenobservablets.Observable.from(obs).map(mapper)
    }),
}

  return client;
} exports.createClient = createClient;
const mapResponse = (path, defaultValue = undefined) => (
  response,
) => {
  const result = _lodashget2.default.call(void 0, response, [...path], defaultValue)

  if (result === undefined) {
      throw new Error(`Response path \`${path.join('.')}\` is empty`)
  }

  return result
}

function getSubscriptionClient(opts = {}, config) {
  const { url: httpClientUrl, subscription = {} } = opts || {};
  let { url, headers = {}, ...restOpts } = opts.subscription || {};
  // by default use the top level url
  if (!url && httpClientUrl) {
    url = _optionalChain([httpClientUrl, 'optionalAccess', _14 => _14.replace, 'call', _15 => _15(/^http/, "ws")]);
  }

  if (!url) {
    throw new Error("Subscription client error: missing url parameter");
  }

  return _graphqlws.createClient.call(void 0, {
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
