"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderSchema = void 0;
const graphql_1 = require("graphql");
function renderSchema(schema, ctx) {
    ctx.addCodeBlock((0, graphql_1.printSchema)(schema));
}
exports.renderSchema = renderSchema;
//# sourceMappingURL=renderSchema.js.map