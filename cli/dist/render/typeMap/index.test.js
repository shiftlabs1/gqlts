"use strict";
var _render = require('../../testHelpers/render');
var _RenderContext = require('../common/RenderContext');

var _objectType = require('./objectType');
var _scalarType = require('./scalarType');
var _unionType = require('./unionType');





const testCase = async (
  schemaGql,
  renderer,
  cases,
  output = false
) => {
  const schema = await _render.toClientSchema.call(void 0, schemaGql);

  const ctx = new (0, _RenderContext.RenderContext)(schema);

  for (const t in cases) {
    const type = schema.getType(t);
    const expected = cases[t];

    if (!type) {
      throw new Error(`type ${t} is not defined in the schema`);
    }

    if (output) {
      console.log(JSON.stringify(renderer(type, ctx), null, 2));
    } else {
      expect(renderer(type, ctx)).toEqual(expected);
    }
  }

  // if (output) throw new Error('test case did not run') // TODO readd tests
};

test("scalarType", () =>
  testCase(
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
    `,
    _scalarType.scalarType,
    {
      String: {},
      Scalar: {},
      Enum: {},
    },
    true
  ));

test("objectType", () =>
  testCase(
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
    `,
    _objectType.objectType,
    {
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
    },
    true
  ));

test("unionType", () =>
  testCase(
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
    `,
    _unionType.unionType,
    {
      Union: {
        on_Some: { type: "Some" },
        on_Other: { type: "Other" },
        on_Another: { type: "Another" },
        __typename: { type: "String" },
      },
    },
    true
  ));
