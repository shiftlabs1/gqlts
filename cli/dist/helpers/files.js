"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _fs = require('fs');
var _mkdirp = require('mkdirp'); var _mkdirp2 = _interopRequireDefault(_mkdirp);
var _path = require('path');
var _rimraf = require('rimraf'); var _rimraf2 = _interopRequireDefault(_rimraf);

 const ensurePath = async (path, clear = false) => {
  if (clear) {
    _rimraf2.default.sync(_path.resolve.call(void 0, ...path));
  }
  _mkdirp2.default.sync(_path.resolve.call(void 0, ...path));
}; exports.ensurePath = ensurePath;

 const requireModuleFromPath = (path) => require(_path.resolve.call(void 0, ...path)); exports.requireModuleFromPath = requireModuleFromPath;

 const readFileFromPath = (path) => _fs.promises.readFile(_path.resolve.call(void 0, ...path)).then((b) => b.toString()); exports.readFileFromPath = readFileFromPath;

 const writeFileToPath = (path, content) => _fs.promises.writeFile(_path.resolve.call(void 0, ...path), content); exports.writeFileToPath = writeFileToPath;

 const readFilesAndConcat = (files) =>
  Promise.all(files.map((file) => exports.readFileFromPath.call(void 0, [file]))).then((contents) => contents.join("\n")); exports.readFilesAndConcat = readFilesAndConcat;
