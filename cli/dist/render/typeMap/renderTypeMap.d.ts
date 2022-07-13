import { CompressedTypeMap, TypeMap } from "gqlgen-runtime/dist/types";
import { GraphQLSchema } from "graphql";
import { RenderContext } from "../common/RenderContext";
export declare function renderTypeMap(schema: GraphQLSchema, ctx: RenderContext): void;
export declare function replaceTypeNamesWithIndexes(typeMap: TypeMap<string>): CompressedTypeMap<number>;
