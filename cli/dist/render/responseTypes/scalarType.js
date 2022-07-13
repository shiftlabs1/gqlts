"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _typeMappedAlias = require('./typeMappedAlias');

 function renderScalarTypes(ctx, types) {
  let content = "";
  types.forEach((type) => {
    content += `    ${type.name}: ${_typeMappedAlias.getTypeMappedAlias.call(void 0, type, ctx)},\n`;
  });
  return `export type Scalars = {\n${content}}`;
} exports.renderScalarTypes = renderScalarTypes;
