"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prettify = void 0;
const standalone_1 = __importDefault(require("prettier/standalone"));
const parser_graphql_1 = __importDefault(require("prettier/parser-graphql"));
const parser_typescript_1 = __importDefault(require("prettier/parser-typescript"));
function prettify(code, parser) {
    // return code
    return standalone_1.default.format(code, {
        parser,
        plugins: [parser_graphql_1.default, parser_typescript_1.default],
        semi: false,
        singleQuote: true,
        trailingComma: "all",
        printWidth: 80,
    });
}
exports.prettify = prettify;
//# sourceMappingURL=prettify.js.map