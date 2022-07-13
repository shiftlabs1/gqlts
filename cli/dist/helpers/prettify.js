"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _standalone = require('prettier/standalone'); var _standalone2 = _interopRequireDefault(_standalone);

var _parsergraphql = require('prettier/parser-graphql'); var _parsergraphql2 = _interopRequireDefault(_parsergraphql);
var _parsertypescript = require('prettier/parser-typescript'); var _parsertypescript2 = _interopRequireDefault(_parsertypescript);

 function prettify(code, parser) {
  // return code
  return _standalone2.default.format(code, {
    parser,
    plugins: [_parsergraphql2.default, _parsertypescript2.default],
    semi: false,
    singleQuote: true,
    trailingComma: "all",
    printWidth: 80,
  });
} exports.prettify = prettify;
