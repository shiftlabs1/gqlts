"use strict";Object.defineProperty(exports, "__esModule", {value: true});







var _graphql = require('graphql');

const render = (
  type,
  nonNull,
  root,
  undefinableValues,
  undefinableFields,
  wrap = (x) => x
) => {
  if (root) {
    if (undefinableFields) {
      if (_graphql.isNonNullType.call(void 0, type)) {
        return `: ${render(type.ofType, true, false, undefinableValues, undefinableFields, wrap)}`;
      } else {
        const rendered = render(type, true, false, undefinableValues, undefinableFields, wrap);
        return undefinableValues ? `?: ${rendered}` : `?: (${rendered} | null)`;
      }
    } else {
      return `: ${render(type, false, false, undefinableValues, undefinableFields, wrap)}`;
    }
  }

  if (_graphql.isNamedType.call(void 0, type)) {
    let typeName = type.name;

    // if is a scalar use the scalar interface to not expose reserved words
    if (_graphql.isScalarType.call(void 0, type)) {
      typeName = `Scalars['${typeName}']`;
    }

    const typing = wrap(typeName);

    if (undefinableValues) {
      return nonNull ? typing : `(${typing} | undefined)`;
    } else {
      return nonNull ? typing : `(${typing} | null)`;
    }
  }

  if (_graphql.isListType.call(void 0, type)) {
    const typing = `${render(type.ofType, false, false, undefinableValues, undefinableFields, wrap)}[]`;

    if (undefinableValues) {
      return nonNull ? typing : `(${typing} | undefined)`;
    } else {
      return nonNull ? typing : `(${typing} | null)`;
    }
  }

  return render((type).ofType, true, false, undefinableValues, undefinableFields, wrap);
};

 function renderTyping(
  type,
  undefinableValues,
  undefinableFields,
  root = true,
  wrap = undefined
) {
  return render(type, false, root, undefinableValues, undefinableFields, wrap);
} exports.renderTyping = renderTyping;
