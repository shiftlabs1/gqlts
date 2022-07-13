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
exports.typeRenderTestCase = exports.typeRenderTest = exports.schemaRenderTest = exports.toClientSchema = void 0;
const graphql_1 = require("graphql");
const RenderContext_1 = require("../render/common/RenderContext");
const files_1 = require("../helpers/files");
function toClientSchema(schemaGql) {
    return __awaiter(this, void 0, void 0, function* () {
        const schema = (0, graphql_1.buildSchema)(schemaGql);
        const introspectionResponse = yield (0, graphql_1.graphql)({ schema, source: (0, graphql_1.getIntrospectionQuery)() });
        if (!introspectionResponse.data) {
            throw new Error(JSON.stringify(introspectionResponse.errors));
        }
        return (0, graphql_1.buildClientSchema)(introspectionResponse.data);
    });
}
exports.toClientSchema = toClientSchema;
function schemaRenderTest(schemaGql, renderer, parser) {
    return __awaiter(this, void 0, void 0, function* () {
        const schema = yield toClientSchema(schemaGql);
        const ctx = new RenderContext_1.RenderContext(schema);
        renderer(schema, ctx);
        return ctx.toCode(parser, true);
    });
}
exports.schemaRenderTest = schemaRenderTest;
function typeRenderTest(schemaGql, renderer, typeNames, parser) {
    return __awaiter(this, void 0, void 0, function* () {
        const schema = yield toClientSchema(schemaGql);
        const ctx = new RenderContext_1.RenderContext(schema);
        typeNames.forEach((typeName) => {
            const type = schema.getType(typeName);
            if (!type) {
                throw new Error(`type ${typeName} is not defined in the schema`);
            }
            renderer(type, ctx);
        });
        return ctx.toCode(parser, true);
    });
}
exports.typeRenderTest = typeRenderTest;
function typeRenderTestCase(dirName, file, renderer, typeNames, output = false) {
    return __awaiter(this, void 0, void 0, function* () {
        const [gql, ts] = yield Promise.all([
            (0, files_1.readFileFromPath)([dirName, `cases/${file}.graphql`]),
            (0, files_1.readFileFromPath)([dirName, `cases/${file}.case.ts`]),
        ]);
        const actualTs = yield typeRenderTest(gql, renderer, typeNames, "typescript");
        if (output) {
            console.log(actualTs);
            throw new Error("test case did not run");
        }
        else {
            expect(actualTs).toBe(ts);
        }
    });
}
exports.typeRenderTestCase = typeRenderTestCase;
//# sourceMappingURL=render.js.map