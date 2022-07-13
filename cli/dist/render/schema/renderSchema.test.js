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
Object.defineProperty(exports, "__esModule", { value: true });
const prettify_1 = require("../../helpers/prettify");
const render_1 = require("../../testHelpers/render");
const renderSchema_1 = require("./renderSchema");
test("renderSchema", () => __awaiter(void 0, void 0, void 0, function* () {
    expect(yield (0, render_1.schemaRenderTest)(
    /* GraphQL */ `
        type A {
          some: String
        }

        type B {
          some: String @deprecated
        }

        type Query {
          _: Boolean
        }
      `, renderSchema_1.renderSchema, "graphql")).toBe((0, prettify_1.prettify)(
    /* GraphQL */ `
        type A {
          some: String
        }

        type B {
          some: String @deprecated
        }

        type Query {
          _: Boolean
        }
      `, "graphql"));
}));
//# sourceMappingURL=renderSchema.test.js.map