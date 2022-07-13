import { GraphQLNamedType, GraphQLSchema } from "graphql";
import { BuiltInParserName } from "prettier";
import { RenderContext } from "../render/common/RenderContext";
export interface TypeRenderer {
    (type: GraphQLNamedType, ctx: RenderContext): void;
}
export interface SchemaRenderer {
    (schema: GraphQLSchema, ctx: RenderContext): void;
}
export declare function toClientSchema(schemaGql: string): Promise<GraphQLSchema>;
export declare function schemaRenderTest(schemaGql: string, renderer: SchemaRenderer, parser?: BuiltInParserName): Promise<string>;
export declare function typeRenderTest(schemaGql: string, renderer: TypeRenderer, typeNames: string[], parser?: BuiltInParserName): Promise<string>;
export declare function typeRenderTestCase(dirName: string, file: string, renderer: TypeRenderer, typeNames: string[], output?: boolean): Promise<void>;
