import { GraphQLSchema } from "graphql";
import { RenderContext } from "../common/RenderContext";
export declare function renderTypeGuards(schema: GraphQLSchema, ctx: RenderContext, isJs?: "ts" | "esm" | "cjs"): void;
