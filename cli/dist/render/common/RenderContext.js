"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenderContext = void 0;
const prettify_1 = require("../../helpers/prettify");
const relativeImportPath_1 = require("./relativeImportPath");
class RenderContext {
    constructor(schema, config) {
        this.schema = schema;
        this.config = config;
        this.codeBlocks = [];
        this.imports = {};
        this.importAliasCounter = 0;
    }
    addCodeBlock(block) {
        if (block) {
            this.codeBlocks.push(block);
        }
    }
    addImport(from, isDefault, module, fromAbsolute, noAlias) {
        if (this.config && this.config.output) {
            from = fromAbsolute ? from : (0, relativeImportPath_1.relativeImportPath)(this.config.output, from);
        }
        if (!this.imports[from])
            this.imports[from] = [];
        const imports = this.imports[from];
        const existing = imports.find((i) => (isDefault && i.isDefault) || (!isDefault && i.module === module));
        if (existing)
            return existing.alias;
        this.importAliasCounter++;
        const alias = noAlias ? undefined : `a${this.importAliasCounter}`;
        imports.push({ isDefault, module, alias });
        return alias;
    }
    getImportBlock() {
        const imports = [];
        Object.keys(this.imports).forEach((from) => {
            let defaultImport = this.imports[from].find((i) => i.isDefault);
            const namedImports = this.imports[from].filter((i) => !i.isDefault);
            const statements = [];
            if (defaultImport) {
                statements.push(defaultImport.alias || "");
            }
            if (namedImports.length > 0) {
                statements.push(`{${namedImports.map((i) => (i.alias ? `${i.module} as ${i.alias}` : i.module)).join(",")}}`);
            }
            imports.push(`import ${statements.join(",")} from '${from}'`);
        });
        if (imports.length > 0)
            return imports.join("\n");
        else
            return;
    }
    toCode(parser, pretty = false) {
        const blocks = [...this.codeBlocks];
        if (parser && (parser === "typescript" || parser === "babel")) {
            const importBlock = this.getImportBlock();
            if (importBlock)
                blocks.unshift(importBlock);
        }
        if (parser && pretty) {
            return (0, prettify_1.prettify)(blocks.join("\n\n"), parser);
        }
        if (parser) {
            return blocks.join("\n\n");
        }
        return blocks.join("");
    }
}
exports.RenderContext = RenderContext;
//# sourceMappingURL=RenderContext.js.map