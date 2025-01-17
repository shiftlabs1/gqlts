import { __assign, __awaiter, __generator, __read, __rest, __spreadArray } from "tslib";
var WebSocketNode = typeof window !== "undefined" ? null : eval('require("ws")');
import { createClient as createWSClient } from "graphql-ws";
import { Observable } from "zen-observable-ts";
import { createFetcher } from "../fetcher";
import { generateGraphqlOperation } from "./generateGraphqlOperation";
import { chain } from './chain';
import get from 'lodash.get';
export function createClient(_a) {
    var queryRoot = _a.queryRoot, mutationRoot = _a.mutationRoot, subscriptionRoot = _a.subscriptionRoot, options = __rest(_a, ["queryRoot", "mutationRoot", "subscriptionRoot"]);
    var _b = createFetcher(options), fetcherMethod = _b.fetcherMethod, fetcherInstance = _b.fetcherInstance;
    var client = {
        fetcherInstance: fetcherInstance,
        fetcherMethod: fetcherMethod,
    };
    if (queryRoot) {
        client.query = function (request, config) {
            if (!queryRoot)
                throw new Error("queryRoot argument is missing");
            return client.fetcherMethod(generateGraphqlOperation("query", queryRoot, request), config);
        };
    }
    if (mutationRoot) {
        client.mutation = function (request, config) {
            if (!mutationRoot)
                throw new Error("mutationRoot argument is missing");
            return client.fetcherMethod(generateGraphqlOperation("mutation", mutationRoot, request), config);
        };
    }
    if (subscriptionRoot) {
        client.subscription = function (request, config) {
            if (!subscriptionRoot) {
                throw new Error("subscriptionRoot argument is missing");
            }
            var op = generateGraphqlOperation("subscription", subscriptionRoot, request);
            if (!client.wsClient) {
                client.wsClient = getSubscriptionClient(options, config);
            }
            return new Observable(function (observer) {
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
        query: chain(function (path, request, defaultValue, config) { var _a; return (_a = client === null || client === void 0 ? void 0 : client.query) === null || _a === void 0 ? void 0 : _a.call(client, request, config).then(mapResponse(path, defaultValue)); }),
        mutation: chain(function (path, request, defaultValue, config) { var _a; return (_a = client === null || client === void 0 ? void 0 : client.mutation) === null || _a === void 0 ? void 0 : _a.call(client, request, config).then(mapResponse(path, defaultValue)); }),
        subscription: chain(function (path, request, defaultValue, config) {
            var _a;
            var obs = (_a = client === null || client === void 0 ? void 0 : client.subscription) === null || _a === void 0 ? void 0 : _a.call(client, request, config);
            var mapper = mapResponse(path, defaultValue);
            return Observable.from(obs).map(mapper);
        }),
    };
    return client;
}
var mapResponse = function (path, defaultValue) {
    if (defaultValue === void 0) { defaultValue = undefined; }
    return function (response) {
        var result = get(response, __spreadArray([], __read(path), false), defaultValue);
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
    var _c = opts.subscription || {}, url = _c.url, _d = _c.headers, headers = _d === void 0 ? {} : _d, restOpts = __rest(_c, ["url", "headers"]);
    // by default use the top level url
    if (!url && httpClientUrl) {
        url = httpClientUrl === null || httpClientUrl === void 0 ? void 0 : httpClientUrl.replace(/^http/, "ws");
    }
    if (!url) {
        throw new Error("Subscription client error: missing url parameter");
    }
    return createWSClient(__assign(__assign(__assign(__assign({}, (typeof window === "undefined" && { webSocketImpl: WebSocketNode })), { url: url, lazy: true, shouldRetry: function () { return true; }, retryAttempts: 3, connectionParams: function () { return __awaiter(_this, void 0, void 0, function () {
            var headersObject, _a;
            return __generator(this, function (_b) {
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