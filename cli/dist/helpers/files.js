"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readFilesAndConcat = exports.writeFileToPath = exports.readFileFromPath = exports.requireModuleFromPath = exports.ensurePath = void 0;
const fs_1 = require("fs");
const mkdirp_1 = __importDefault(require("mkdirp"));
const path_1 = require("path");
const rimraf_1 = __importDefault(require("rimraf"));
const ensurePath = (path, clear = false) => __awaiter(void 0, void 0, void 0, function* () {
    if (clear) {
        rimraf_1.default.sync((0, path_1.resolve)(...path));
    }
    mkdirp_1.default.sync((0, path_1.resolve)(...path));
});
exports.ensurePath = ensurePath;
const requireModuleFromPath = (path) => require((0, path_1.resolve)(...path));
exports.requireModuleFromPath = requireModuleFromPath;
const readFileFromPath = (path) => fs_1.promises.readFile((0, path_1.resolve)(...path)).then((b) => b.toString());
exports.readFileFromPath = readFileFromPath;
const writeFileToPath = (path, content) => fs_1.promises.writeFile((0, path_1.resolve)(...path), content);
exports.writeFileToPath = writeFileToPath;
const readFilesAndConcat = (files) => Promise.all(files.map((file) => (0, exports.readFileFromPath)([file]))).then((contents) => contents.join("\n"));
exports.readFilesAndConcat = readFilesAndConcat;
//# sourceMappingURL=files.js.map