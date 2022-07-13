import { GraphQLEnumType, GraphQLScalarType } from "graphql";
import { RenderContext } from "../common/RenderContext";
import { Type } from "gqlgen-runtime/dist/types";
export declare function scalarType(type: GraphQLScalarType | GraphQLEnumType, _: RenderContext): Type<string>;
