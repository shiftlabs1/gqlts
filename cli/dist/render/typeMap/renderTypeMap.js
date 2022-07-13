"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceTypeNamesWithIndexes = exports.renderTypeMap = void 0;
const graphql_1 = require("graphql");
const excludedTypes_1 = require("../common/excludedTypes");
const objectType_1 = require("./objectType");
const unionType_1 = require("./unionType");
function renderTypeMap(schema, ctx) {
    // remove fields key,
    // remove the Type.type and Type.args, replace with [type, args]
    // reverse args.{name}
    // Args type is deduced and added only when the concrete type is different from type name, remove the scalar field and replace with a top level scalars array field.
    const result = {
        scalars: [],
        types: {},
    };
    Object.keys(schema.getTypeMap())
        .filter((t) => !excludedTypes_1.excludedTypes.includes(t))
        .map((t) => schema.getTypeMap()[t])
        .map((t) => {
        if ((0, graphql_1.isObjectType)(t) || (0, graphql_1.isInterfaceType)(t) || (0, graphql_1.isInputObjectType)(t))
            result.types[t.name] = (0, objectType_1.objectType)(t, ctx);
        else if ((0, graphql_1.isUnionType)(t))
            result.types[t.name] = (0, unionType_1.unionType)(t, ctx);
        else if ((0, graphql_1.isScalarType)(t) || (0, graphql_1.isEnumType)(t)) {
            result.scalars.push(t.name);
            result.types[t.name] = {};
        }
    });
    // change names of query, mutation on schemas that chose different names (hasura)
    const q = schema.getQueryType();
    if ((q === null || q === void 0 ? void 0 : q.name) && (q === null || q === void 0 ? void 0 : q.name) !== "Query") {
        delete result.types[q.name];
        result.types.Query = (0, objectType_1.objectType)(q, ctx);
        // result.Query.name = 'Query'
    }
    const m = schema.getMutationType();
    if ((m === null || m === void 0 ? void 0 : m.name) && m.name !== "Mutation") {
        delete result.types[m.name];
        result.types.Mutation = (0, objectType_1.objectType)(m, ctx);
        // result.Mutation.name = 'Mutation'
    }
    const s = schema.getSubscriptionType();
    if ((s === null || s === void 0 ? void 0 : s.name) && s.name !== "Subscription") {
        delete result.types[s.name];
        result.types.Subscription = (0, objectType_1.objectType)(s, ctx);
        // result.Subscription.name = 'Subscription'
    }
    ctx.addCodeBlock(JSON.stringify(replaceTypeNamesWithIndexes(result), null, 4));
}
exports.renderTypeMap = renderTypeMap;
function replaceTypeNamesWithIndexes(typeMap) {
    const nameToIndex = Object.assign({}, ...Object.keys(typeMap.types).map((k, i) => ({ [k]: i })));
    const scalars = typeMap.scalars.map((x) => nameToIndex[x]);
    const types = Object.assign({}, ...Object.keys(typeMap.types || {}).map((k) => {
        const type = typeMap.types[k];
        const fieldsMap = type || {};
        // processFields(fields, indexToName)
        const fields = Object.assign({}, ...Object.keys(fieldsMap).map((f) => {
            const content = fieldsMap[f];
            if (!content) {
                throw new Error("no content in field " + f);
            }
            const [typeName, args] = [content.type, content.args];
            const res = [typeName ? nameToIndex[typeName] : -1];
            if (args) {
                res[1] = Object.assign({}, ...Object.keys(args || {}).map((k) => {
                    const arg = args === null || args === void 0 ? void 0 : args[k];
                    if (!arg) {
                        throw new Error("replaceTypeNamesWithIndexes: no arg for " + k);
                    }
                    return {
                        [k]: [nameToIndex[arg[0]], ...arg.slice(1)],
                    };
                }));
            }
            return {
                [f]: res,
            };
        }));
        return {
            [k]: Object.assign({}, fields),
        };
    }));
    return {
        scalars,
        types,
    };
}
exports.replaceTypeNamesWithIndexes = replaceTypeNamesWithIndexes;
//# sourceMappingURL=renderTypeMap.js.map