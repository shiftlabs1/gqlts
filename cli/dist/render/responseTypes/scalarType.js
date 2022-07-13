"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderScalarTypes = void 0;
const typeMappedAlias_1 = require("./typeMappedAlias");
function renderScalarTypes(ctx, types) {
    let content = "";
    types.forEach((type) => {
        content += `    ${type.name}: ${(0, typeMappedAlias_1.getTypeMappedAlias)(type, ctx)},\n`;
    });
    return `export type Scalars = {\n${content}}`;
}
exports.renderScalarTypes = renderScalarTypes;
//# sourceMappingURL=scalarType.js.map