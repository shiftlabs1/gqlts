#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.printHelp = void 0;
const chalk_1 = __importDefault(require("chalk"));
const yargs_1 = __importDefault(require("yargs"));
const main_1 = require("./main");
const validateConfigs_1 = require("./tasks/validateConfigs");
const version_1 = require("./version");
const fs_1 = require("fs");
const parse_1 = require("./helpers/parse");
const program = (0, yargs_1.default)(process.argv.slice(2))
    .option("output", {
    alias: "o",
    description: "Output directory",
    required: true,
    type: "string",
})
    .option("endpoint", {
    alias: "e",
    description: "Graphql endpoint",
    type: "string",
})
    .option("get", {
    alias: "g",
    description: "use GET for introspection query",
    type: "boolean",
})
    .option("schema", {
    alias: "s",
    type: "string",
    description: "path to GraphQL schema definition file",
})
    // .array('header', )
    .option("header", {
    alias: "H",
    type: "array",
    string: true,
    description: "header to use in introspection query",
})
    .option("scalar", {
    alias: "S",
    type: "array",
    string: true,
    description: "map a scalar to a type, for example `-S DateTime:string` ",
})
    .option("methodPrefix", {
    alias: "mp",
    type: "string",
    default: "",
    string: true,
    description: "prefix for generated methods",
})
    .option("methodSuffix", {
    alias: "ms",
    type: "string",
    default: "",
    string: true,
    description: "suffix for generated methods",
})
    .option("esm", {
    type: "boolean",
    default: false,
    description: "generate only ES modules code, ./generated/index.js will use esm exports and imports",
})
    .option("esm-and-cjs", {
    type: "boolean",
    default: false,
    description: "generate both ES modules code and CJS code, useful when publishing a package, ./generated/index.js will use CJS require",
})
    .option("sort", {
    type: "boolean",
    default: false,
    description: "sort object properties to not create diffs after generations",
})
    .option("verbose", { alias: "v", type: "boolean", default: false })
    .example('$0 --output ./generated --endpoint http://localhost:3000  -H "Authorization: Bearer xxx"', "generate the client from an endpoint")
    .example("$0 --output ./generated --schema ./schema.graphql", "generate the client from a schema")
    .help("help")
    .help("h")
    .parseSync();
// .option('-o, --output <./myClient>', 'output directory')
// .option('-e, --endpoint <http://example.com/graphql>', 'GraphQL endpoint')
// .option('-g, --get', 'use GET for introspection query')
// .option(
//     '-s, --schema <./mySchema.graphql>',
//     'path to GraphQL schema definition file',
// )
// .option(
//     '-f, --fetcher <./schemaFetcher.js>',
//     'path to introspection query fetcher file',
// )
// .option('-H', '--header')
// .option('-v, --verbose', 'verbose output')
// .parse(process.argv)
const config = {
    endpoint: program.endpoint,
    useGet: program.get,
    schema: program.schema && readFile(program.schema),
    output: program.output,
    methodPrefix: (_a = program.methodPrefix) !== null && _a !== void 0 ? _a : "",
    methodSuffix: (_b = program.methodSuffix) !== null && _b !== void 0 ? _b : "",
    headers: (0, parse_1.parseColonSeparatedStrings)(program.header || []),
    scalarTypes: (0, parse_1.parseColonSeparatedStrings)(program.scalar || []),
    onlyEsModules: program.esm,
    onlyCJSModules: !program["esm-and-cjs"] && !program.esm,
    verbose: program.verbose,
    sortProperties: program.sort,
};
if (!(0, validateConfigs_1.validateConfigs)([config])) {
    process.exit(1);
}
(0, main_1.generate)(config)
    .catch((e) => {
    console.error(chalk_1.default.red("Cannot generate, got an error:"));
    console.error(e);
    process.exit(1);
})
    .then(() => {
    printHelp({
        dirPath: program.output,
        useYarn: false,
        dependencies: [`@gqlts/runtime@${version_1.version}`, "graphql"],
    });
});
function printHelp({ useYarn, dirPath, dependencies }) {
    console.log();
    console.log(`${chalk_1.default.green("Success!")} Generated client code inside '${dirPath}'`);
    console.log();
    console.log(chalk_1.default.bold("Remember to install the necessary runtime package with:"));
    console.log();
    console.log(`  ${chalk_1.default.cyan(`${useYarn ? "yarn add" : "npm install"} ${dependencies.join(" ")}`)}`);
    console.log();
    console.log("PS: `@gqlts/runtime` should always have the same version as the cli!");
    console.log();
}
exports.printHelp = printHelp;
function readFile(p) {
    if (!(0, fs_1.existsSync)(p)) {
        console.log(`file '${p}' does not exist`);
        process.exit(1);
    }
    return (0, fs_1.readFileSync)(p).toString();
}
//# sourceMappingURL=cli.js.map