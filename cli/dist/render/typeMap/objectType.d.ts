import { GraphQLInputObjectType, GraphQLInterfaceType, GraphQLObjectType } from "graphql";
import { RenderContext } from "../common/RenderContext";
import { FieldMap } from "gqlgen-runtime/dist/types";
export declare function objectType(type: GraphQLObjectType | GraphQLInterfaceType | GraphQLInputObjectType, ctx: RenderContext): FieldMap<string>;
