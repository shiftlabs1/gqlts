"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const render_1 = require("../../testHelpers/render");
const inputObjectType_1 = require("./inputObjectType");
const objectType_1 = require("./objectType");
const unionType_1 = require("./unionType");
test("unionType", () => (0, render_1.typeRenderTestCase)(__dirname, "unionType", unionType_1.unionType, ["Union", "UnionD", "UnionMD"]));
test("inputObjectType", () => (0, render_1.typeRenderTestCase)(__dirname, "inputObjectType", inputObjectType_1.inputObjectType, [
    "InputF",
    "Input",
    "InputD",
    "InputMD",
]));
test("objectType", () => (0, render_1.typeRenderTestCase)(__dirname, "objectType", objectType_1.objectType, ["Interface", "Object", "InterfaceField"]));
//# sourceMappingURL=index.test.js.map