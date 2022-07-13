"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _isomorphicunfetch = require('isomorphic-unfetch'); var _isomorphicunfetch2 = _interopRequireDefault(_isomorphicunfetch);
var _graphql = require('graphql');

var _qs = require('qs'); var _qs2 = _interopRequireDefault(_qs);





 async function fetchSchema({
  endpoint,
  usePost = false,
  headers,
  options,
}




) {
  const response = await _isomorphicunfetch2.default.call(void 0, 
    usePost ? endpoint : `${endpoint}?${_qs2.default.stringify({ query: _graphql.getIntrospectionQuery.call(void 0, ) })}`,
    usePost
      ? {
          method: usePost ? "POST" : "GET",
          body: JSON.stringify({ query: _graphql.getIntrospectionQuery.call(void 0, ) }),
          headers: { ...headers, "Content-Type": "application/json" },
        }
      : {
          headers,
        }
  );
  if (!response.ok) {
    throw new Error("introspection query was not successful, " + response.statusText);
  }

  const result = await response.json().catch((e) => {
    const contentType = response.headers.get("Content-Type");
    console.log(`content type is ${contentType}`);
    throw new Error(
      `endpoint '${endpoint}' did not return valid json, check that your endpoint points to a valid graphql api`
    );
  });
  if (!result.data) {
    throw new Error("introspection request did not receive a valid response");
  }

  // console.log(result.data)
  // console.log(JSON.stringify(result.data, null, 4))

  return _graphql.buildClientSchema.call(void 0, result.data, options);
} exports.fetchSchema = fetchSchema;

 async function customFetchSchema(fetcher, options) {
  const result = await fetcher(_graphql.getIntrospectionQuery.call(void 0, ), _isomorphicunfetch2.default, _qs2.default);

  if (!result.data) {
    throw new Error("introspection request did not receive a valid response");
  }

  return _graphql.buildClientSchema.call(void 0, result.data , options);
} exports.customFetchSchema = customFetchSchema;
