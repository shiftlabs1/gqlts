"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.customFetchSchema = exports.fetchSchema = void 0;
const isomorphic_unfetch_1 = __importDefault(require("isomorphic-unfetch"));
const graphql_1 = require("graphql");
const qs_1 = __importDefault(require("qs"));
function fetchSchema({ endpoint, usePost = false, headers, options, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield (0, isomorphic_unfetch_1.default)(usePost ? endpoint : `${endpoint}?${qs_1.default.stringify({ query: (0, graphql_1.getIntrospectionQuery)() })}`, usePost
            ? {
                method: usePost ? "POST" : "GET",
                body: JSON.stringify({ query: (0, graphql_1.getIntrospectionQuery)() }),
                headers: Object.assign(Object.assign({}, headers), { "Content-Type": "application/json" }),
            }
            : {
                headers,
            });
        if (!response.ok) {
            throw new Error("introspection query was not successful, " + response.statusText);
        }
        const result = yield response.json().catch((e) => {
            const contentType = response.headers.get("Content-Type");
            console.log(`content type is ${contentType}`);
            throw new Error(`endpoint '${endpoint}' did not return valid json, check that your endpoint points to a valid graphql api`);
        });
        if (!result.data) {
            throw new Error("introspection request did not receive a valid response");
        }
        // console.log(result.data)
        // console.log(JSON.stringify(result.data, null, 4))
        return (0, graphql_1.buildClientSchema)(result.data, options);
    });
}
exports.fetchSchema = fetchSchema;
function customFetchSchema(fetcher, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield fetcher((0, graphql_1.getIntrospectionQuery)(), isomorphic_unfetch_1.default, qs_1.default);
        if (!result.data) {
            throw new Error("introspection request did not receive a valid response");
        }
        return (0, graphql_1.buildClientSchema)(result.data, options);
    });
}
exports.customFetchSchema = customFetchSchema;
//# sourceMappingURL=fetchSchema.js.map