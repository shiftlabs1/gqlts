"use strict";Object.defineProperty(exports, "__esModule", {value: true});


var _lodash = require('lodash');

 function unionType(type, _) {
  const types = type.getTypes();
  const typeObj = types.reduce((r, t) => {
    r[`on_${t.name}`] = { type: t.name };
    return r;
  }, {});

  const commonInterfaces = _lodash.uniq.call(void 0, _lodash.flatten.call(void 0, types.map((x) => x.getInterfaces())));
  commonInterfaces.forEach((t) => {
    typeObj[`on_${t.name}`] = { type: t.name };
  });

  typeObj.__typename = { type: "String" };

  return typeObj;
} exports.unionType = unionType;
