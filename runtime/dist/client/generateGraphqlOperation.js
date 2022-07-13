"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }var _getFieldFromPath = require('./getFieldFromPath');
































function parseRequest(request, ctx, path) {
  if (Array.isArray(request)) {
    const [args, fields] = request;
    const argNames = Object.keys(args);

    if (argNames.length === 0) {
      return parseRequest(fields, ctx, path);
    }

    const field = _getFieldFromPath.getFieldFromPath.call(void 0, ctx.root, path);

    return `(${argNames.map((argName) => {
      ctx.varCounter++;
      const varName = `v${ctx.varCounter}`;

      const typing = field.args && field.args[argName]; // typeMap used here, .args

      if (!typing) {
        throw new Error(`no typing defined for argument \`${argName}\` in path \`${path.join(".")}\``);
      }

      ctx.variables[varName] = {
        value: args[argName],
        typing,
      };

      return `${argName}:$${varName}`;
    })})${parseRequest(fields, ctx, path)}`;
  } else if (typeof request === "object") {
    const fields = request;
    const fieldNames = Object.keys(fields).filter((k) => Boolean(fields[k]));

    if (fieldNames.length === 0) {
      // TODO if fields are empty just return?
      throw new Error("field selection should not be empty");
    }

    const type = path.length > 0 ? _getFieldFromPath.getFieldFromPath.call(void 0, ctx.root, path).type : ctx.root;
    const scalarFields = type.scalar;

    let scalarFieldsFragment;

    if (fieldNames.includes("__scalar")) {
      const falsyFieldNames = new Set(Object.keys(fields).filter((k) => !Boolean(fields[k])));
      if (_optionalChain([scalarFields, 'optionalAccess', _ => _.length])) {
        ctx.fragmentCounter++;
        scalarFieldsFragment = `f${ctx.fragmentCounter}`;

        ctx.fragments.push(
          `fragment ${scalarFieldsFragment} on ${type.name}{${scalarFields
            .filter((f) => !falsyFieldNames.has(f))
            .join(",")}}`
        );
      }
    }

    const fieldsSelection = fieldNames
      .filter((f) => !["__scalar", "__name"].includes(f))
      .map((f) => {
        const parsed = parseRequest(fields[f], ctx, [...path, f]);

        if (f.startsWith("on_")) {
          ctx.fragmentCounter++;
          const implementationFragment = `f${ctx.fragmentCounter}`;

          const typeMatch = f.match(/^on_(.+)/);

          if (!typeMatch || !typeMatch[1]) throw new Error("match failed");

          ctx.fragments.push(`fragment ${implementationFragment} on ${typeMatch[1]}${parsed}`);

          return `...${implementationFragment}`;
        } else {
          return `${f}${parsed}`;
        }
      })
      .concat(scalarFieldsFragment ? [`...${scalarFieldsFragment}`] : [])
      .join(",");

    return `{${fieldsSelection}}`;
  } else {
    return "";
  }
}

 function generateGraphqlOperation(
  operation,
  root,
  fields
) {
  const ctx = {
    root,
    varCounter: 0,
    variables: {},
    fragmentCounter: 0,
    fragments: [],
  };
  const result = parseRequest(fields, ctx, []);

  const varNames = Object.keys(ctx.variables);

  const varsString =
    varNames.length > 0
      ? `(${varNames.map((v) => {
          const variableType = ctx.variables[v].typing[1];
          //   console.log('variableType', variableType)
          return `$${v}:${variableType}`;
        })})`
      : "";

  const operationName = _optionalChain([fields, 'optionalAccess', _2 => _2.__name]) || "";

  return {
    query: [`${operation} ${operationName}${varsString}${result}`, ...ctx.fragments].join(","),
    variables: Object.keys(ctx.variables).reduce((r, v) => {
      r[v] = ctx.variables[v].value;
      return r;
    }, {}),
  };
} exports.generateGraphqlOperation = generateGraphqlOperation;
