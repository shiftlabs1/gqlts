"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var _lodashstartswith = require('lodash.startswith'); var _lodashstartswith2 = _interopRequireDefault(_lodashstartswith);

 function getFieldFromPath(root, path) {
  let current;

  if (!root) throw new Error("root type is not provided");

  if (path.length === 0) throw new Error(`path is empty`);

  path.forEach((f) => {
    const type = current ? current.type : root;

    if (!type.fields) throw new Error(`type \`${type.name}\` does not have fields`);

    const possibleTypes = Object.keys(type.fields)
      .filter((i) => _lodashstartswith2.default.call(void 0, i, "on_"))
      .reduce(
        (types, fieldName) => {
          const field = type.fields && type.fields[fieldName];
          if (field) types.push(field.type);
          return types;
        },
        [type]
      );

    let field = null;

    possibleTypes.forEach((type) => {
      const found = type.fields && type.fields[f];
      if (found) field = found;
    });

    if (!field) throw new Error(`type \`${type.name}\` does not have a field \`${f}\``);

    current = field;
  });

  return current;
} exports.getFieldFromPath = getFieldFromPath;
