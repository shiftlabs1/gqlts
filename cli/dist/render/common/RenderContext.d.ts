import { GraphQLSchema } from "graphql";
import { BuiltInParserName } from "prettier";
import { Config } from "../../config";
interface Import {
    isDefault: boolean;
    module?: string;
    alias?: string;
}
interface ImportMap {
    [from: string]: Import[];
}
export declare class RenderContext {
    schema?: GraphQLSchema | undefined;
    config?: Config | undefined;
    protected codeBlocks: string[];
    protected imports: ImportMap;
    protected importAliasCounter: number;
    constructor(schema?: GraphQLSchema | undefined, config?: Config | undefined);
    addCodeBlock(block: string): void;
    addImport(from: string, isDefault: boolean, module?: string, fromAbsolute?: boolean, noAlias?: boolean): string | undefined;
    protected getImportBlock(): string | undefined;
    toCode(parser?: BuiltInParserName, pretty?: boolean): string;
}
export {};
