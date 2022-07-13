import { CompressedTypeMap, TypeMap } from "@gqlts/runtime/dist/types";
import { GraphQLSchema } from "graphql";
import { RenderContext } from "../common/RenderContext";
export declare function renderTypeMap(schema: GraphQLSchema, ctx: RenderContext): void;
export declare function replaceTypeNamesWithIndexes(typeMap: TypeMap<string>): CompressedTypeMap<number>;
