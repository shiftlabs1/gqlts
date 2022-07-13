import { GraphQLSchema } from "graphql";
import { RenderContext } from "../common/RenderContext";
export declare function renderEnumsMaps(schema: GraphQLSchema, moduleType: "esm" | "cjs" | "type"): string;
export declare function renderClientCjs(schema: GraphQLSchema, ctx: RenderContext): void;
export declare function renderClientEsm(schema: GraphQLSchema, ctx: RenderContext): void;
