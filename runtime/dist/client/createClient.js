"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClient = void 0;
var tslib_1 = require("tslib");
var WebSocketNode = typeof window !== "undefined" ? null : eval('require("ws")');
var graphql_ws_1 = require("graphql-ws");
var zen_observable_ts_1 = require("zen-observable-ts");
var fetcher_1 = require("../fetcher");
var generateGraphqlOperation_1 = require("./generateGraphqlOperation");
var chain_1 = require("./chain");
var lodash_get_1 = tslib_1.__importDefault(require("lodash.get"));
function createClient(_a) {
    var queryRoot = _a.queryRoot, mutationRoot = _a.mutationRoot, subscriptionRoot = _a.subscriptionRoot, options = tslib_1.__rest(_a, ["queryRoot", "mutationRoot", "subscriptionRoot"]);
    var _b = (0, fetcher_1.createFetcher)(options), fetcherMethod = _b.fetcherMethod, fetcherInstance = _b.fetcherInstance;
    var client = {
        fetcherInstance: fetcherInstance,
        fetcherMethod: fetcherMethod,
    };
    if (queryRoot) {
        client.query = function (request, config) {
            if (!queryRoot)
                throw new Error("queryRoot argument is missing");
            return client.fetcherMethod((0, generateGraphqlOperation_1.generateGraphqlOperation)("query", queryRoot, request), config);
        };
    }
    if (mutationRoot) {
        client.mutation = function (request, config) {
            if (!mutationRoot)
                throw new Error("mutationRoot argument is missing");
            return client.fetcherMethod((0, generateGraphqlOperation_1.generateGraphqlOperation)("mutation", mutationRoot, request), config);
        };
    }
    if (subscriptionRoot) {
        client.subscription = function (request, config) {
            if (!subscriptionRoot) {
                throw new Error("subscriptionRoot argument is missing");
            }
            var op = (0, generateGraphqlOperation_1.generateGraphqlOperation)("subscription", subscriptionRoot, request);
            if (!client.wsClient) {
                client.wsClient = getSubscriptionClient(options, config);
            }
            return new zen_observable_ts_1.Observable(function (observer) {
                var _a;
                return (_a = client.wsClient) === null || _a === void 0 ? void 0 : _a.subscribe(op, {
                    next: function (data) { return observer.next(data); },
                    error: function (err) { return observer.error(err); },
                    complete: function () { return observer.complete(); },
                });
            });
        };
    }
    client.chain = {
        query: (0, chain_1.chain)(function (path, request, defaultValue, config) {
            return client.query(request, config).then(mapResponse(path, defaultValue));
        }),
        mutation: (0, chain_1.chain)(function (path, request, defaultValue, config) {
            return client.mutation(request, config).then(mapResponse(path, defaultValue));
        }),
        subscription: (0, chain_1.chain)(function (path, request, defaultValue, config) {
            var obs = client.subscription(request, config);
            var mapper = mapResponse(path, defaultValue);
            return zen_observable_ts_1.Observable.from(obs).map(mapper);
        }),
    };
    return client;
}
exports.createClient = createClient;
var mapResponse = function (path, defaultValue) {
    if (defaultValue === void 0) { defaultValue = undefined; }
    return function (response) {
        var result = (0, lodash_get_1.default)(response, tslib_1.__spreadArray([], tslib_1.__read(path), false), defaultValue);
        if (result === undefined) {
            throw new Error("Response path `".concat(path.join('.'), "` is empty"));
        }
        return result;
    };
};
function getSubscriptionClient(opts, config) {
    var _this = this;
    if (opts === void 0) { opts = {}; }
    var _a = opts || {}, httpClientUrl = _a.url, _b = _a.subscription, subscription = _b === void 0 ? {} : _b;
    var _c = opts.subscription || {}, url = _c.url, _d = _c.headers, headers = _d === void 0 ? {} : _d, restOpts = tslib_1.__rest(_c, ["url", "headers"]);
    // by default use the top level url
    if (!url && httpClientUrl) {
        url = httpClientUrl === null || httpClientUrl === void 0 ? void 0 : httpClientUrl.replace(/^http/, "ws");
    }
    if (!url) {
        throw new Error("Subscription client error: missing url parameter");
    }
    return (0, graphql_ws_1.createClient)(tslib_1.__assign(tslib_1.__assign(tslib_1.__assign(tslib_1.__assign({}, (typeof window === "undefined" && { webSocketImpl: WebSocketNode })), { url: url, lazy: true, shouldRetry: function () { return true; }, retryAttempts: 3, connectionParams: function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var headersObject, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(typeof headers == "function")) return [3 /*break*/, 2];
                        return [4 /*yield*/, headers()];
                    case 1:
                        _a = _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        _a = headers;
                        _b.label = 3;
                    case 3:
                        headersObject = _a;
                        headersObject = headersObject || {};
                        return [2 /*return*/, {
                                headers: headersObject,
                            }];
                }
            });
        }); } }), restOpts), config));
}
//# sourceMappingURL=createClient.js.map