import { ASTNode } from "graphql/language/ast";
/**
 * Converts an AST into a string, using one set of reasonable
 * formatting rules.
 */
export declare type PrintOptions = {
    clientVarName?: string;
    transformVariableName?: (x: string) => string;
    thenCode?: string;
};
export declare function print(ast: ASTNode, options?: PrintOptions): ASTNode;
