import { GraphQLArgument, GraphQLEnumValue, GraphQLField, GraphQLInputField, GraphQLNamedType } from "graphql";
export declare function comment(comment: {
    text?: string | null;
    deprecated?: string | null;
}): string;
export declare function typeComment(type: GraphQLNamedType): string;
export declare function fieldComment(field: GraphQLEnumValue | GraphQLField<any, any, any>): string;
export declare function argumentComment(arg: GraphQLArgument | GraphQLInputField): string;
