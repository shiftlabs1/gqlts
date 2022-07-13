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
exports.clientTasks = void 0;
const listr_1 = __importDefault(require("listr"));
const files_1 = require("../helpers/files");
const renderClient_1 = require("../render/client/renderClient");
const renderClientDefinition_1 = require("../render/client/renderClientDefinition");
const RenderContext_1 = require("../render/common/RenderContext");
const renderRequestTypes_1 = require("../render/requestTypes/renderRequestTypes");
const renderResponseTypes_1 = require("../render/responseTypes/renderResponseTypes");
const renderSchema_1 = require("../render/schema/renderSchema");
const renderTypeGuards_1 = require("../render/typeGuards/renderTypeGuards");
const renderTypeMap_1 = require("../render/typeMap/renderTypeMap");
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
    if (!config.output)
        throw new Error("`output` must be defined in the config");
    const output = config.output;
    const tasks = [
        {
            title: `writing ${schemaGqlFile}`,
            task: (ctx) => __awaiter(this, void 0, void 0, function* () {
                const renderCtx = new RenderContext_1.RenderContext(ctx.schema, config);
                (0, renderSchema_1.renderSchema)(ctx.schema, renderCtx);
                yield (0, files_1.writeFileToPath)([output, schemaGqlFile], renderCtx.toCode("graphql"));
            }),
        },
        {
            title: `writing ${schemaTypesFile}`,
            task: (ctx) => __awaiter(this, void 0, void 0, function* () {
                const renderCtx = new RenderContext_1.RenderContext(ctx.schema, config);
                (0, renderResponseTypes_1.renderResponseTypes)(ctx.schema, renderCtx);
                (0, renderRequestTypes_1.renderRequestTypes)(ctx.schema, renderCtx);
                (0, renderTypeGuards_1.renderTypeGuards)(ctx.schema, renderCtx);
                yield (0, files_1.writeFileToPath)([output, schemaTypesFile], renderCtx.toCode("typescript"));
            }),
        },
        !config.onlyCJSModules && {
            title: `writing ${guardsFileEsm}`,
            task: (ctx) => __awaiter(this, void 0, void 0, function* () {
                const renderCtx = new RenderContext_1.RenderContext(ctx.schema, config);
                (0, renderTypeGuards_1.renderTypeGuards)(ctx.schema, renderCtx, "esm");
                yield (0, files_1.writeFileToPath)([output, guardsFileEsm], renderCtx.toCode("typescript"));
            }),
        },
        !config.onlyEsModules && {
            title: `writing ${guardsFileCjs}`,
            task: (ctx) => __awaiter(this, void 0, void 0, function* () {
                const renderCtx = new RenderContext_1.RenderContext(ctx.schema, config);
                (0, renderTypeGuards_1.renderTypeGuards)(ctx.schema, renderCtx, "cjs");
                yield (0, files_1.writeFileToPath)([output, guardsFileCjs], renderCtx.toCode("typescript"));
            }),
        },
        {
            title: `writing types`,
            task: (ctx) => __awaiter(this, void 0, void 0, function* () {
                const renderCtx = new RenderContext_1.RenderContext(ctx.schema, config);
                (0, renderTypeMap_1.renderTypeMap)(ctx.schema, renderCtx);
                if (!config.onlyEsModules) {
                    yield (0, files_1.writeFileToPath)([output, typeMapFileCjs], `module.exports = ${renderCtx.toCode()}`);
                }
                if (!config.onlyCJSModules) {
                    yield (0, files_1.writeFileToPath)([output, typeMapFileEsm], `export default ${renderCtx.toCode()}`);
                }
            }),
        },
        !config.onlyEsModules && {
            title: `writing ${clientFileCjs}`,
            task: (ctx) => __awaiter(this, void 0, void 0, function* () {
                const renderCtx = new RenderContext_1.RenderContext(ctx.schema, config);
                (0, renderClient_1.renderClientCjs)(ctx.schema, renderCtx);
                yield (0, files_1.writeFileToPath)([output, clientFileCjs], renderCtx.toCode("typescript", true));
            }),
        },
        !config.onlyCJSModules && {
            title: `writing ${clientFileEsm}`,
            task: (ctx) => __awaiter(this, void 0, void 0, function* () {
                const renderCtx = new RenderContext_1.RenderContext(ctx.schema, config);
                (0, renderClient_1.renderClientEsm)(ctx.schema, renderCtx);
                yield (0, files_1.writeFileToPath)([output, clientFileEsm], renderCtx.toCode("typescript", true));
            }),
        },
        {
            title: `writing ${clientTypesFile}`,
            task: (ctx) => __awaiter(this, void 0, void 0, function* () {
                const renderCtx = new RenderContext_1.RenderContext(ctx.schema, config);
                (0, renderClientDefinition_1.renderClientDefinition)(ctx.schema, renderCtx);
                yield (0, files_1.writeFileToPath)([output, clientTypesFile], renderCtx.toCode("typescript", true));
            }),
        },
    ];
    return [
        {
            title: "preparing client directory",
            task: () => (0, files_1.ensurePath)([output], true),
        },
        {
            title: `writing files`,
            task: () => new listr_1.default(tasks.filter((x) => Boolean(x)), { concurrent: true }),
        },
    ];
}
exports.clientTasks = clientTasks;
//# sourceMappingURL=clientTasks.js.map