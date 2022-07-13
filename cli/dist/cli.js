#!/usr/bin/env node
"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }var _chalk = require('chalk'); var _chalk2 = _interopRequireDefault(_chalk);
var _yargs = require('yargs'); var _yargs2 = _interopRequireDefault(_yargs);
var _main = require('./main');
var _validateConfigs = require('./tasks/validateConfigs');

var _version = require('./version');
var _fs = require('fs');
var _parse = require('./helpers/parse');

const program = _yargs2.default.call(void 0, process.argv.slice(2))
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
    description:
      "generate both ES modules code and CJS code, useful when publishing a package, ./generated/index.js will use CJS require",
  })
  .option("sort", {
    type: "boolean",
    default: false,
    description: "sort object properties to not create diffs after generations",
  })
  .option("verbose", { alias: "v", type: "boolean", default: false })
  .example(
    '$0 --output ./generated --endpoint http://localhost:3000  -H "Authorization: Bearer xxx"',
    "generate the client from an endpoint"
  )
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
  methodPrefix: _nullishCoalesce(program.methodPrefix, () => ( "")),
  methodSuffix: _nullishCoalesce(program.methodSuffix, () => ( "")),
  headers: _parse.parseColonSeparatedStrings.call(void 0, program.header || []),
  scalarTypes: _parse.parseColonSeparatedStrings.call(void 0, program.scalar || []),
  onlyEsModules: program.esm,
  onlyCJSModules: !program["esm-and-cjs"] && !program.esm,
  verbose: program.verbose,
  sortProperties: program.sort,
};

if (!_validateConfigs.validateConfigs.call(void 0, [config])) {
  process.exit(1);
}

_main.generate.call(void 0, config)
  .catch((e) => {
    console.error(_chalk2.default.red("Cannot generate, got an error:"));
    console.error(e);
    process.exit(1);
  })
  .then(() => {
    printHelp({
      dirPath: program.output,
      useYarn: false,
      dependencies: [`gqlgen-runtime@${_version.version}`, "graphql"],
    });
  });

 function printHelp({ useYarn, dirPath, dependencies }) {
  console.log();
  console.log(`${_chalk2.default.green("Success!")} Generated client code inside '${dirPath}'`);
  console.log();
  console.log(_chalk2.default.bold("Remember to install the necessary runtime package with:"));
  console.log();
  console.log(`  ${_chalk2.default.cyan(`${useYarn ? "yarn add" : "npm install"} ${dependencies.join(" ")}`)}`);
  console.log();
  console.log("PS: `gqlgen-runtime` should always have the same version as the cli!");
  console.log();
} exports.printHelp = printHelp;

function readFile(p) {
  if (!_fs.existsSync.call(void 0, p)) {
    console.log(`file '${p}' does not exist`);
    process.exit(1);
  }
  return _fs.readFileSync.call(void 0, p).toString();
}
