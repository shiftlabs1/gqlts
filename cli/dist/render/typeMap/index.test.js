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
const render_1 = require("../../testHelpers/render");
const RenderContext_1 = require("../common/RenderContext");
const objectType_1 = require("./objectType");
const scalarType_1 = require("./scalarType");
const unionType_1 = require("./unionType");
const testCase = (schemaGql, renderer, cases, output = false) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = yield (0, render_1.toClientSchema)(schemaGql);
    const ctx = new RenderContext_1.RenderContext(schema);
    for (const t in cases) {
        const type = schema.getType(t);
        const expected = cases[t];
        if (!type) {
            throw new Error(`type ${t} is not defined in the schema`);
        }
        if (output) {
            console.log(JSON.stringify(renderer(type, ctx), null, 2));
        }
        else {
            expect(renderer(type, ctx)).toEqual(expected);
        }
    }
    // if (output) throw new Error('test case did not run') // TODO readd tests
});
test("scalarType", () => testCase(
/* GraphQL */ `
      enum Enum {
        some
        other
      }

      scalar Scalar

      type Query {
        scalar: String
        customScalar: Scalar
        enum: Enum
      }
    `, scalarType_1.scalarType, {
    String: {},
    Scalar: {},
    Enum: {},
}, true));
test("objectType", () => testCase(
/* GraphQL */ `
      interface Interface {
        some: String
      }

      type ImplementorA implements Interface {
        some: String
      }

      type ImplementorB implements Interface {
        some: String
      }

      type Object {
        scalar: Int
        object: Object
        interface: Interface
        optionalArgScalar(arg: Int): Int
        optionalArgObject(arg: Int): Object
        optionalArgInterface(arg: Int): Interface
        nestedArg(a: [[[Int]]], b: [[[Int!]!]!]!): Boolean
      }

      type ObjectWithoutScalar {
        object: Object
        interface: Interface
      }

      type Query {
        _: Boolean
      }
    `, objectType_1.objectType, {
    Object: {
        scalar: { type: "Int" },
        object: { type: "Object" },
        interface: { type: "Interface" },
        optionalArgScalar: {
            type: "Int",
            args: { arg: ["Int", "Int"] },
        },
        optionalArgObject: {
            type: "Object",
            args: { arg: ["Int", "Int"] },
        },
        optionalArgInterface: {
            type: "Interface",
            args: { arg: ["Int", "Int"] },
        },
        nestedArg: {
            type: "Boolean",
            args: {
                a: ["[[[Int]]]", "Int"],
                b: ["[[[Int!]!]!]!", "Int"],
            },
        },
        __typename: { type: "String" },
        // scalar: ['scalar', 'optionalArgScalar', 'nestedArg'],
    },
    Interface: {
        some: { type: "String" },
        on_ImplementorA: { type: "ImplementorA" },
        on_ImplementorB: { type: "ImplementorB" },
        __typename: { type: "String" },
        // scalar: ['some'],
    },
    ObjectWithoutScalar: {
        __typename: { type: "String" },
        interface: { type: "Interface" },
        object: { type: "Object" },
    },
}, true));
test("unionType", () => testCase(
/* GraphQL */ `
      type Some {
        field: Int
      }

      type Other {
        field: Int
      }

      type Another {
        field: Int
      }

      union Union = Some | Other | Another

      type Query {
        _: Boolean
      }
    `, unionType_1.unionType, {
    Union: {
        on_Some: { type: "Some" },
        on_Other: { type: "Other" },
        on_Another: { type: "Another" },
        __typename: { type: "String" },
    },
}, true));
//# sourceMappingURL=index.test.js.map