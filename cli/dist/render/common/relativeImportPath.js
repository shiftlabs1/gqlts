"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.relativeImportPath = void 0;
const path_1 = __importDefault(require("path"));
function relativeImportPath(from, to) {
    const fromResolved = path_1.default.relative(from, to);
    return fromResolved[0] === "." ? fromResolved : `./${fromResolved}`;
}
exports.relativeImportPath = relativeImportPath;
//# sourceMappingURL=relativeImportPath.js.map