"use strict";var _render = require('../../testHelpers/render');
var _inputObjectType = require('./inputObjectType');
var _objectType = require('./objectType');
var _unionType = require('./unionType');

test("unionType", () =>
  _render.typeRenderTestCase.call(void 0, __dirname, "unionType", _unionType.unionType, ["Union", "UnionD", "UnionMD"]));

test("inputObjectType", () =>
  _render.typeRenderTestCase.call(void 0, __dirname, "inputObjectType", _inputObjectType.inputObjectType, [
    "InputF",
    "Input",
    "InputD",
    "InputMD",
  ]));

test("objectType", () =>
  _render.typeRenderTestCase.call(void 0, __dirname, "objectType", _objectType.objectType, ["Interface", "Object", "InterfaceField"]));
