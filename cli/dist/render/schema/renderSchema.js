"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _graphql = require('graphql');


 function renderSchema(schema, ctx) {
  ctx.addCodeBlock(_graphql.printSchema.call(void 0, schema));
} exports.renderSchema = renderSchema;
