export declare const RUNTIME_LIB_NAME = "gqlgen-runtime";
export interface Config {
    verbose?: boolean;
    endpoint?: string;
    useGet?: boolean;
    schema?: string;
    output?: string;
    methodPrefix?: string;
    methodSuffix?: string;
    headers?: Record<string, string>;
    scalarTypes?: {
        [k: string]: string;
    };
    onlyEsModules?: boolean;
    onlyCJSModules?: boolean;
    sortProperties?: boolean;
}
