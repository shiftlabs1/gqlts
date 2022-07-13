"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _listr = require('listr'); var _listr2 = _interopRequireDefault(_listr);

var _files = require('../helpers/files');
var _renderClient = require('../render/client/renderClient');
var _renderClientDefinition = require('../render/client/renderClientDefinition');
var _RenderContext = require('../render/common/RenderContext');
var _renderRequestTypes = require('../render/requestTypes/renderRequestTypes');
var _renderResponseTypes = require('../render/responseTypes/renderResponseTypes');
var _renderSchema = require('../render/schema/renderSchema');
var _renderTypeGuards = require('../render/typeGuards/renderTypeGuards');
var _renderTypeMap = require('../render/typeMap/renderTypeMap');

const schemaGqlFile = "schema.graphql";
const schemaTypesFile = "schema.ts";
const guardsFileCjs = "guards.cjs.js";
const guardsFileEsm = "guards.esm.js";
const typeMapFileCjs = "types.cjs.js";
const typeMapFileEsm = "types.esm.js";
const clientFileCjs = "index.js";
const clientTypesFile = "index.d.ts";

 function clientTasks(config) {
  const clientFileEsm = config.onlyEsModules ? "index.js" : "index.esm.js";

  if (!config.output) throw new Error("`output` must be defined in the config");

  const output = config.output;

  const tasks = [
    {
      title: `writing ${schemaGqlFile}`,
      task: async (ctx) => {
        const renderCtx = new (0, _RenderContext.RenderContext)(ctx.schema, config);
        _renderSchema.renderSchema.call(void 0, ctx.schema, renderCtx);
        await _files.writeFileToPath.call(void 0, [output, schemaGqlFile], renderCtx.toCode("graphql"));
      },
    },
    {
      title: `writing ${schemaTypesFile}`,
      task: async (ctx) => {
        const renderCtx = new (0, _RenderContext.RenderContext)(ctx.schema, config);

        _renderResponseTypes.renderResponseTypes.call(void 0, ctx.schema, renderCtx);
        _renderRequestTypes.renderRequestTypes.call(void 0, ctx.schema, renderCtx);
        _renderTypeGuards.renderTypeGuards.call(void 0, ctx.schema, renderCtx);

        await _files.writeFileToPath.call(void 0, [output, schemaTypesFile], renderCtx.toCode("typescript"));
      },
    },
    !config.onlyCJSModules && {
      title: `writing ${guardsFileEsm}`,
      task: async (ctx) => {
        const renderCtx = new (0, _RenderContext.RenderContext)(ctx.schema, config);

        _renderTypeGuards.renderTypeGuards.call(void 0, ctx.schema, renderCtx, "esm");

        await _files.writeFileToPath.call(void 0, [output, guardsFileEsm], renderCtx.toCode("typescript"));
      },
    },
    !config.onlyEsModules && {
      title: `writing ${guardsFileCjs}`,
      task: async (ctx) => {
        const renderCtx = new (0, _RenderContext.RenderContext)(ctx.schema, config);

        _renderTypeGuards.renderTypeGuards.call(void 0, ctx.schema, renderCtx, "cjs");

        await _files.writeFileToPath.call(void 0, [output, guardsFileCjs], renderCtx.toCode("typescript"));
      },
    },
    {
      title: `writing types`,
      task: async (ctx) => {
        const renderCtx = new (0, _RenderContext.RenderContext)(ctx.schema, config);

        _renderTypeMap.renderTypeMap.call(void 0, ctx.schema, renderCtx);

        if (!config.onlyEsModules) {
          await _files.writeFileToPath.call(void 0, [output, typeMapFileCjs], `module.exports = ${renderCtx.toCode()}`);
        }
        if (!config.onlyCJSModules) {
          await _files.writeFileToPath.call(void 0, [output, typeMapFileEsm], `export default ${renderCtx.toCode()}`);
        }
      },
    },
    !config.onlyEsModules && {
      title: `writing ${clientFileCjs}`,
      task: async (ctx) => {
        const renderCtx = new (0, _RenderContext.RenderContext)(ctx.schema, config);

        _renderClient.renderClientCjs.call(void 0, ctx.schema, renderCtx);
        await _files.writeFileToPath.call(void 0, [output, clientFileCjs], renderCtx.toCode("typescript", true));
      },
    },
    !config.onlyCJSModules && {
      title: `writing ${clientFileEsm}`,
      task: async (ctx) => {
        const renderCtx = new (0, _RenderContext.RenderContext)(ctx.schema, config);
        _renderClient.renderClientEsm.call(void 0, ctx.schema, renderCtx);
        await _files.writeFileToPath.call(void 0, [output, clientFileEsm], renderCtx.toCode("typescript", true));
      },
    },
    {
      title: `writing ${clientTypesFile}`,
      task: async (ctx) => {
        const renderCtx = new (0, _RenderContext.RenderContext)(ctx.schema, config);

        _renderClientDefinition.renderClientDefinition.call(void 0, ctx.schema, renderCtx);

        await _files.writeFileToPath.call(void 0, [output, clientTypesFile], renderCtx.toCode("typescript", true));
      },
    },
  ];

  return [
    {
      title: "preparing client directory",
      task: () => _files.ensurePath.call(void 0, [output], true),
    },
    {
      title: `writing files`,
      task: () => new (0, _listr2.default)(tasks.filter((x) => Boolean(x)) , { concurrent: true }),
    },
  ];
} exports.clientTasks = clientTasks;
