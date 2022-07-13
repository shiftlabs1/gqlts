"use strict";Object.defineProperty(exports, "__esModule", {value: true});






var _graphql = require('graphql');

var _RenderContext = require('../render/common/RenderContext');
var _files = require('../helpers/files');









 async function toClientSchema(schemaGql) {
  const schema = _graphql.buildSchema.call(void 0, schemaGql);

  const introspectionResponse = await _graphql.graphql.call(void 0, { schema, source: _graphql.getIntrospectionQuery.call(void 0, ) });

  if (!introspectionResponse.data) {
    throw new Error(JSON.stringify(introspectionResponse.errors));
  }

  return _graphql.buildClientSchema.call(void 0, introspectionResponse.data );
} exports.toClientSchema = toClientSchema;

 async function schemaRenderTest(schemaGql, renderer, parser) {
  const schema = await toClientSchema(schemaGql);

  const ctx = new (0, _RenderContext.RenderContext)(schema);

  renderer(schema, ctx);

  return ctx.toCode(parser, true);
} exports.schemaRenderTest = schemaRenderTest;

 async function typeRenderTest(
  schemaGql,
  renderer,
  typeNames,
  parser
) {
  const schema = await toClientSchema(schemaGql);

  const ctx = new (0, _RenderContext.RenderContext)(schema);

  typeNames.forEach((typeName) => {
    const type = schema.getType(typeName);

    if (!type) {
      throw new Error(`type ${typeName} is not defined in the schema`);
    }

    renderer(type, ctx);
  });

  return ctx.toCode(parser, true);
} exports.typeRenderTest = typeRenderTest;

 async function typeRenderTestCase(
  dirName,
  file,
  renderer,
  typeNames,
  output = false
) {
  const [gql, ts] = await Promise.all([
    _files.readFileFromPath.call(void 0, [dirName, `cases/${file}.graphql`]),
    _files.readFileFromPath.call(void 0, [dirName, `cases/${file}.case.ts`]),
  ]);

  const actualTs = await typeRenderTest(gql, renderer, typeNames, "typescript");

  if (output) {
    console.log(actualTs);
    throw new Error("test case did not run");
  } else {
    expect(actualTs).toBe(ts);
  }
} exports.typeRenderTestCase = typeRenderTestCase;
