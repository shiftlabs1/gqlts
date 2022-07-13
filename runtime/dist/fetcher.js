"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }

var _extractfiles = require('./extract-files/extract-files');
var _batcher = require('./client/batcher');
var _axios = require('axios'); var _axios2 = _interopRequireDefault(_axios);
var _formdata = require('form-data'); var _formdata2 = _interopRequireDefault(_formdata);











const DEFAULT_BATCH_OPTIONS = {
  maxBatchSize: 10,
  batchInterval: 40,
};

 function createFetcher(params) {
  const { url = "", timeout = 100000, headers = {}, batch = false, ...rest } = params;
  let { fetcherMethod, fetcherInstance } = params;

  if (!url && !fetcherMethod) {
    throw new Error("url or fetcher is required");
  }

  if (!fetcherInstance) {
    fetcherInstance = _axios2.default.create({});
  }
  if (!fetcherMethod) {
    fetcherMethod = async (body, config) => {
      const { clone, files } = _extractfiles.extractFiles.call(void 0, body);

      let formData = undefined;
      if (files.size > 0) {
        formData = new (0, _formdata2.default)();
        // 1. First document is graphql query with variables
        formData.append("operations", JSON.stringify(clone));
        // 2. Second document maps files to variable locations
        const map = {};
        let i = 0;
        files.forEach((paths) => {
          map[i++] = paths;
        });
        formData.append("map", JSON.stringify(map));
        // 3. all files not (same index as in map)
        let j = 0;
        for (const [file] of files) {
          formData.append(`${j++}`, file, file.name);
        }
      }

      const headersObject = {
        "Content-Type": "application/json",
        ...(typeof headers == "function" ? await headers() : headers),
        ...(!!_optionalChain([formData, 'optionalAccess', _ => _.getHeaders]) && _optionalChain([formData, 'optionalAccess', _2 => _2.getHeaders, 'call', _3 => _3()])),
      };
      const fetchBody = files.size && formData ? formData : JSON.stringify(body);
      return (fetcherInstance )({
        url,
        data: fetchBody,
        method: "POST",
        headers: headersObject,
        timeout,
        withCredentials: true,
        ...rest,
        ...config,
      })
        .then((res) => {
          if (res.status === 200) {
            return res.data;
          }
          return {
            data: null,
            errors: [{ message: res.statusText, code: res.status, path: ["clientResponseNotOk"] }],
          };
        })
        .catch((err) => {
          return { data: null, errors: [{ message: err.message, code: err.code, path: ["clientResponseError"] }] };
        });
    };
  }

  if (!batch) {
    return {
      fetcherMethod: async (body, config) => {
        if (!fetcherMethod) {
          throw new Error("fetcher is required");
        }
        return fetcherMethod(body, config);
      },
      fetcherInstance,
    };
  }

  // todo test batcher
  const batcher = new (0, _batcher.QueryBatcher)(
    async (batchedQuery, config) => {
      // console.log(batchedQuery) // [{ query: 'query{user{age}}', variables: {} }, ...]
      if (!fetcherMethod) {
        throw new Error("fetcher is not defined");
      }
      return fetcherMethod(batchedQuery, config);
    },
    batch === true ? DEFAULT_BATCH_OPTIONS : batch
  );

  return {
    fetcherMethod: async ({ query, variables }, config) => {
      return batcher.fetch({ query, variables, config });
    },
    fetcherInstance,
  };
} exports.createFetcher = createFetcher;
