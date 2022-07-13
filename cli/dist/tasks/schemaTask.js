"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _graphql = require('graphql');


var _graphqlfileloader = require('@graphql-tools/graphql-file-loader');
var _fetchSchema = require('../schema/fetchSchema');
var _load = require('@graphql-tools/load');

 function schemaTask(config) {
  const processSchema = (schema) => {
    if (config.sortProperties) {
      return _graphql.lexicographicSortSchema.call(void 0, schema);
    }
    return schema;
  };

  if (config.endpoint) {
    const endpoint = config.endpoint;
    return {
      title: `fetching schema using ${config.useGet ? "GET" : "POST"} ${endpoint} and headers ${JSON.stringify(
        config.headers
      )}`,
      task: async (ctx) => {
        ctx.schema = processSchema(
          await _fetchSchema.fetchSchema.call(void 0, {
            endpoint,
            usePost: !config.useGet,
            headers: config.headers,
          })
        );
      },
    };
  } else if (config.schema) {
    const schema = config.schema;
    return {
      title: "loading schema",
      task: async (ctx) => {
        // const options = config.options && config.options.schemaBuild
        const document = await _load.loadSchema.call(void 0, schema, {
          loaders: [new (0, _graphqlfileloader.GraphQLFileLoader)()],
        });
        ctx.schema = processSchema(document);

        try {
          _graphql.assertValidSchema.call(void 0, ctx.schema);
        } catch (e) {
          if (e.message === "Query root type must be provided.") return;
          throw e;
        }
      },
    };
  } else {
    throw new Error("either `endpoint`, `fetcher` or `schema` must be defined in the config");
  }
} exports.schemaTask = schemaTask;
