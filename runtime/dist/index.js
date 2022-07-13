"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _createNamedExportFrom(obj, localName, importedName) { Object.defineProperty(exports, localName, {enumerable: true, configurable: true, get: () => obj[importedName]}); }var _createClient = require('./client/createClient'); _createNamedExportFrom(_createClient, 'createClient', 'createClient');
;
;
;
var _generateGraphqlOperation = require('./client/generateGraphqlOperation'); _createNamedExportFrom(_generateGraphqlOperation, 'generateGraphqlOperation', 'generateGraphqlOperation');
;
var _linkTypeMap = require('./client/linkTypeMap'); _createNamedExportFrom(_linkTypeMap, 'linkTypeMap', 'linkTypeMap');
var _zenobservablets = require('zen-observable-ts'); _createNamedExportFrom(_zenobservablets, 'Observable', 'Observable');
var _fetcher = require('./fetcher'); _createNamedExportFrom(_fetcher, 'createFetcher', 'createFetcher');
var _error = require('./error'); _createNamedExportFrom(_error, 'ClientError', 'ClientError');
 const everything = {
  __scalar: true,
}; exports.everything = everything;

 function assertSameVersion(generatedWithVersion) {
  try {
    if (typeof require === "undefined") {
      return;
    }
    const { version } = require("../package.json");
    if (generatedWithVersion && generatedWithVersion.trim() != version.trim()) {
      console.error(
        "[WARNING]: gqlts client library has been generated with a different version of `@gqlts/runtime`, update both packages to have the same version!"
      );
    }
  } catch (e) {}
} exports.assertSameVersion = assertSameVersion;

//
