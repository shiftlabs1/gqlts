"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
var _lodashassign = require('lodash.assign'); var _lodashassign2 = _interopRequireDefault(_lodashassign);








 function linkTypeMap(typeMap) {
  const indexToName = _lodashassign2.default.call(void 0, {}, ...Object.keys(typeMap.types).map((k, i) => ({ [i]: k })));

  // add the name value
  let intermediaryTypeMap = _lodashassign2.default.call(void 0, 
    {},
    ...Object.keys(typeMap.types || {}).map((k) => {
      const type = typeMap.types[k];
      const fields = type || {};
      // processFields(fields, indexToName)
      return {
        [k]: {
          name: k,
          // type scalar properties
          scalar: Object.keys(fields).filter((f) => {
            const [type] = _nullishCoalesce(fields[f], () => ( []));
            if (!type) {
              return false;
            }
            return typeMap.scalars.includes(type);
          }),
          // fields with corresponding `type` and `args`
          fields: _lodashassign2.default.call(void 0, 
            {},
            ...Object.keys(fields).map((f) => {
              const [typeIndex, args] = _nullishCoalesce(fields[f], () => ( []));
              if (!typeIndex) {
                return {};
              }
              return {
                [f]: {
                  // replace index with type name
                  type: indexToName[typeIndex],
                  args: _lodashassign2.default.call(void 0, 
                    {},
                    ...Object.keys(_nullishCoalesce(args, () => ( {}))).map((k) => {
                      if (!args || !args[k]) {
                        return {};
                      }
                      // if argTypeString == argTypeName, argTypeString is missing, need to read it
                      const [argTypeName, argTypeString] = _nullishCoalesce(args[k], () => ( []));
                      if (!argTypeName) {
                        return {};
                      }
                      return {
                        [k]: [indexToName[argTypeName], argTypeString || indexToName[argTypeName]],
                      };
                    })
                  ),
                },
              };
            })
          ),
        },
      };
    })
  );
  const res = exports.resolveConcreteTypes.call(void 0, intermediaryTypeMap);
  return res;
} exports.linkTypeMap = linkTypeMap;

// replace typename with concrete type
 const resolveConcreteTypes = (linkedTypeMap) => {
  Object.keys(linkedTypeMap).forEach((typeNameFromKey) => {
    const type = linkedTypeMap[typeNameFromKey];
    // type.name = typeNameFromKey
    if (!_optionalChain([type, 'optionalAccess', _ => _.fields])) {
      return;
    }

    const fields = type.fields;

    Object.keys(fields).forEach((f) => {
      const field = fields[f];

      if (_optionalChain([field, 'optionalAccess', _2 => _2.args])) {
        const args = field.args;
        Object.keys(args).forEach((key) => {
          const arg = args[key];

          if (arg) {
            const [typeName] = arg;

            if (typeof typeName === "string") {
              if (!linkedTypeMap[typeName]) {
                linkedTypeMap[typeName] = { name: typeName };
              }

              arg[0] = linkedTypeMap[typeName];
            }
          }
        });
      }

      const typeName = _optionalChain([field, 'optionalAccess', _3 => _3.type]);

      if (_optionalChain([field, 'optionalAccess', _4 => _4.type]) && typeof typeName === "string") {
        if (!linkedTypeMap[typeName]) {
          linkedTypeMap[typeName] = { name: typeName };
        }

        field.type = linkedTypeMap[typeName];
      }
    });
  });

  return linkedTypeMap;
}; exports.resolveConcreteTypes = resolveConcreteTypes;
