export declare const ensurePath: (path: string[], clear?: boolean) => Promise<void>;
export declare const requireModuleFromPath: (path: string[]) => any;
export declare const readFileFromPath: (path: string[]) => Promise<string>;
export declare const writeFileToPath: (path: string[], content: string) => Promise<void>;
export declare const readFilesAndConcat: (files: string[]) => Promise<string>;
