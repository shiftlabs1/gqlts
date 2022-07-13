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
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemaTask = void 0;
const graphql_1 = require("graphql");
const graphql_file_loader_1 = require("@graphql-tools/graphql-file-loader");
const fetchSchema_1 = require("../schema/fetchSchema");
const load_1 = require("@graphql-tools/load");
function schemaTask(config) {
    const processSchema = (schema) => {
        if (config.sortProperties) {
            return (0, graphql_1.lexicographicSortSchema)(schema);
        }
        return schema;
    };
    if (config.endpoint) {
        const endpoint = config.endpoint;
        return {
            title: `fetching schema using ${config.useGet ? "GET" : "POST"} ${endpoint} and headers ${JSON.stringify(config.headers)}`,
            task: (ctx) => __awaiter(this, void 0, void 0, function* () {
                ctx.schema = processSchema(yield (0, fetchSchema_1.fetchSchema)({
                    endpoint,
                    usePost: !config.useGet,
                    headers: config.headers,
                }));
            }),
        };
    }
    else if (config.schema) {
        const schema = config.schema;
        return {
            title: "loading schema",
            task: (ctx) => __awaiter(this, void 0, void 0, function* () {
                // const options = config.options && config.options.schemaBuild
                const document = yield (0, load_1.loadSchema)(schema, {
                    loaders: [new graphql_file_loader_1.GraphQLFileLoader()],
                });
                ctx.schema = processSchema(document);
                try {
                    (0, graphql_1.assertValidSchema)(ctx.schema);
                }
                catch (e) {
                    if (e.message === "Query root type must be provided.")
                        return;
                    throw e;
                }
            }),
        };
    }
    else {
        throw new Error("either `endpoint`, `fetcher` or `schema` must be defined in the config");
    }
}
exports.schemaTask = schemaTask;
//# sourceMappingURL=schemaTask.js.map