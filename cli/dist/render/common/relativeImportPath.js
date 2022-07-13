"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _path = require('path'); var _path2 = _interopRequireDefault(_path);

 function relativeImportPath(from, to) {
  const fromResolved = _path2.default.relative(from, to);
  return fromResolved[0] === "." ? fromResolved : `./${fromResolved}`;
} exports.relativeImportPath = relativeImportPath;
