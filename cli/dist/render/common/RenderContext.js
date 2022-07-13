"use strict";Object.defineProperty(exports, "__esModule", {value: true});


var _prettify = require('../../helpers/prettify');
var _relativeImportPath = require('./relativeImportPath');











 class RenderContext {
   __init() {this.codeBlocks = []}
   __init2() {this.imports = {}}
   __init3() {this.importAliasCounter = 0}

  constructor( schema,  config) {;this.schema = schema;this.config = config;RenderContext.prototype.__init.call(this);RenderContext.prototype.__init2.call(this);RenderContext.prototype.__init3.call(this);}

  addCodeBlock(block) {
    if (block) {
      this.codeBlocks.push(block);
    }
  }

  addImport(from, isDefault, module, fromAbsolute, noAlias) {
    if (this.config && this.config.output) {
      from = fromAbsolute ? from : _relativeImportPath.relativeImportPath.call(void 0, this.config.output, from);
    }

    if (!this.imports[from]) this.imports[from] = [];

    const imports = this.imports[from];

    const existing = imports.find((i) => (isDefault && i.isDefault) || (!isDefault && i.module === module));

    if (existing) return existing.alias;

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

    if (imports.length > 0) return imports.join("\n");
    else return;
  }

  toCode(parser, pretty = false) {
    const blocks = [...this.codeBlocks];

    if (parser && (parser === "typescript" || parser === "babel")) {
      const importBlock = this.getImportBlock();
      if (importBlock) blocks.unshift(importBlock);
    }
    if (parser && pretty) {
      return _prettify.prettify.call(void 0, blocks.join("\n\n"), parser);
    }
    if (parser) {
      return blocks.join("\n\n");
    }
    return blocks.join("");
  }
} exports.RenderContext = RenderContext;
