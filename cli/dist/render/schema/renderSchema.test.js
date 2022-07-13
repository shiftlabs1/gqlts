"use strict";var _prettify = require('../../helpers/prettify');
var _render = require('../../testHelpers/render');
var _renderSchema = require('./renderSchema');

test("renderSchema", async () => {
  expect(
    await _render.schemaRenderTest.call(void 0, 
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
      `,
      _renderSchema.renderSchema,
      "graphql"
    )
  ).toBe(
    _prettify.prettify.call(void 0, 
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
      `,
      "graphql"
    )
  );
});
