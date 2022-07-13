import { GraphQLUnionType } from "graphql";
import { RenderContext } from "../common/RenderContext";
import { FieldMap } from "gqlgen-runtime/dist/types";
export declare function unionType(type: GraphQLUnionType, _: RenderContext): FieldMap<string>;
