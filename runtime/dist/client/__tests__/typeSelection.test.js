"use strict"; function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }


// types requirements
/*
- no arguments, only request objects
    - response type picks from request type
        - at first level
        - at nested level
    - response type has all fields if __scalar is present
    - response type does not have __scalar field
        - at first level
        - at nested levels
    - response type is union of the on_ fields values (after their selection)
    - response type does not have on_ fields
    - works with NoExtraProperties
*/









































































describe("pick", () => {
  const req = {
    category: {
      a: 1,
      b: 1,
      nested1: {
        a: 1,
      },
    },
    argumentSyntax: [
      { x: 3 },
      {
        a: 1,
        nesting: {
          __scalar: 1,
        },
      },
    ] ,
  };
  const z = {} ;
  test(
    "response type picks from request type",
    dontExecute(() => {
      z.category;
      z.category.a;
      z.category.b;
      // @ts-expect-error
      z.category.c;
      z.category.nested1.a;
    })
  );
  test(
    "response type does not have additional properties",
    dontExecute(() => {
      // TODO i can access keys with value type equal never
      // @ts-expect-error
      z.order;
      // @ts-expect-error
      z.category.nested1.b;
      // @ts-expect-error
      z.category.nested1.b;
      // @ts-expect-error
      z.category.nested1.c;
      // @ts-expect-error
      z.category.nested2;
    })
  );
  test(
    "argument syntax",
    dontExecute(() => {
      z.argumentSyntax.a.toLocaleLowerCase;
    })
  );
});

describe("__scalar", () => {
  const req = {
    __name: "name",
    category: {
      __scalar: 1,
      nested1: {
        a: 1,
      },
    },
    argumentSyntax: [
      { a: 7 },
      {
        __scalar: 1,
      },
    ] ,
  };
  const z = {} ;
  test(
    "response type picks from request type",
    dontExecute(() => {
      z.category;
      z.category.a;
      z.category.b;
      z.category.c;
      z.category.nested1.a;
      z.category.a.getDate;
      z.category.b.getDate;
    })
  );
  test(
    "response type does not have additional properties",
    dontExecute(() => {
      // TODO i can access keys with value type equal never
      // @ts-expect-error
      z.order;
      // @ts-expect-error
      z.category.nested1.b;
      // @ts-expect-error
      z.category.nested1.c;
      // @ts-expect-error
      z.category.nested2;
    })
  );
  test(
    "__scalar is not present",
    dontExecute(() => {
      // @ts-expect-error
      z.category.__scalar;
    })
  );
  test(
    "__name is not present",
    dontExecute(() => {
      // @ts-expect-error __name
      z.__name;
    })
  );
  test(
    "argument syntax",
    dontExecute(() => {
      z.argumentSyntax.a.toLocaleLowerCase;
      _optionalChain([z, 'access', _3 => _3.argumentSyntax, 'access', _4 => _4.optional, 'optionalAccess', _5 => _5.big]);
      // @ts-expect-error
      z.argumentSyntax.nesting.x;
    })
  );
});

describe("optional fields", () => {
  const req = {
    optionalFields: {
      a: 1,
      b: 1,
    },
    category: {
      optionalFieldsNested: {
        __scalar: 1,
      },
    },
    argumentSyntax: [
      {},
      {
        optional: 1,
      },
    ] ,
  };
  const z = {} ;
  test(
    "optional fields are preserved",
    dontExecute(() => {
      // @ts-expect-error
      z.optionalFields.a.toLocaleLowerCase;
      _optionalChain([z, 'access', _6 => _6.optionalFields, 'access', _7 => _7.a, 'optionalAccess', _8 => _8.toLocaleLowerCase]);
      // @ts-expect-error
      z.optionalFields.b.toLocaleLowerCase;
      _optionalChain([z, 'access', _9 => _9.optionalFields, 'access', _10 => _10.b, 'optionalAccess', _11 => _11.toFixed]);
      // @ts-expect-error
      z.category.optionalFieldsNested.a;
      // @ts-expect-error
      _optionalChain([z, 'access', _12 => _12.category, 'optionalAccess', _13 => _13.optionalFieldsNested, 'access', _14 => _14.a]);
    })
  );
  test(
    "optional fields are preserved in __scalar",
    dontExecute(() => {
      // @ts-expect-error
      z.optionalFields.a.toLocaleLowerCase;
      _optionalChain([z, 'access', _15 => _15.optionalFields, 'access', _16 => _16.a, 'optionalAccess', _17 => _17.toLocaleLowerCase]);
      // @ts-expect-error
      z.optionalFields.b.toLocaleLowerCase;
      _optionalChain([z, 'access', _18 => _18.optionalFields, 'access', _19 => _19.b, 'optionalAccess', _20 => _20.toFixed]);
      // @ts-expect-error
      z.category.optionalFieldsNested.a;
      _optionalChain([z, 'access', _21 => _21.category, 'access', _22 => _22.optionalFieldsNested, 'optionalAccess', _23 => _23.a, 'optionalAccess', _24 => _24.toLocaleLowerCase]);
    })
  );
  test(
    "argument syntax",
    dontExecute(() => {
      // @ts-expect-error optional
      z.argumentSyntax.optional.toLocaleLowerCase;
      _optionalChain([z, 'access', _25 => _25.argumentSyntax, 'access', _26 => _26.optional, 'optionalAccess', _27 => _27.toLocaleLowerCase]);
    })
  );
});

describe("unions", () => {
  const req = {
    union: {
      onX: {
        a: 1,
        __scalar: 1,
      },
    },
    nesting: {
      nestedUnion: {
        onX: {
          a: 1,
        },
        onY: {
          b: 1,
        },
      },
    },
    argumentSyntax: {
      union: {
        a: 1,
        onX: {
          b: 1,
        },
      },
    },
  };
  const z = {} ;
  test(
    "pick union fields",
    dontExecute(() => {
      z.union.a.toLocaleLowerCase;
      z.union.a.toLocaleLowerCase;
      z.nesting.nestedUnion.a.toLocaleLowerCase;
    })
  );
  test(
    "does not have __isUnion",
    dontExecute(() => {
      // @ts-expect-error
      z.union.__isUnion;
      // @ts-expect-error
      z.nesting.nestedUnion.__isUnion;
    })
  );
  test(
    "argument syntax",
    dontExecute(() => {
      z.argumentSyntax.union.a.charAt;
      // @ts-expect-error
      z.argumentSyntax.a;
    })
  );
});

describe("hide fields in request", () => {
  const SKIP = false;
  const req = {
    category: {
      a: 1,
      b: SKIP,
      c: false ,
    },
  };
  const z = {} ;
  // test(
  //     'cannot access falsy fields',
  //     dontExecute(() => {
  //         z.category.a
  //         // @ts-expect-error inaccessible
  //         z.category.b
  //         // @ts-expect-error inaccessible
  //         z.category.c
  //     }),
  // )
});

describe("arrays", () => {
  const req = {
    list: {
      a: 1,
      x: 1,
      optional: 1,
    },
    nested: [
      { x: 1 },
      {
        __scalar: 1,
        list: {
          edges: {
            x: 1,
          },
        },
      },
    ] ,
    argumentSyntax: {
      list: {
        x: 1,
        optional: 1,
      },
    },
  };
  const z = {} ;
  test(
    "list",
    dontExecute(() => {
      z.list[0].a.charCodeAt;
      z.list[0].x.toFixed;
    })
  );
  test(
    "nested",
    dontExecute(() => {
      _optionalChain([z, 'access', _28 => _28.nested, 'optionalAccess', _29 => _29.list, 'optionalAccess', _30 => _30[0], 'optionalAccess', _31 => _31.edges, 'optionalAccess', _32 => _32[0], 'access', _33 => _33.x, 'optionalAccess', _34 => _34.toFixed]);
    })
  );
  test(
    "maintain optionals",
    dontExecute(() => {
      // @ts-expect-error optional
      z.list[0].optional.bold;
      _optionalChain([z, 'access', _35 => _35.list, 'access', _36 => _36[0], 'access', _37 => _37.optional, 'optionalAccess', _38 => _38.bold]);
    })
  );
  test(
    "args syntax",
    dontExecute(() => {
      z.argumentSyntax.list[0].x;
      _optionalChain([z, 'access', _39 => _39.argumentSyntax, 'access', _40 => _40.list, 'access', _41 => _41[0], 'access', _42 => _42.optional, 'optionalAccess', _43 => _43.blink]);
      // @ts-expect-error optional
      z.argumentSyntax.list[0].optional.blink;
    })
  );
});

describe("literals unions", () => {
  const req = {
    literalsUnion: 1,
  };
  const z = {} ;
  test(
    "literals",
    dontExecute(() => {
      z.literalsUnion.blink;
      z.literalsUnion === "a";
      z.literalsUnion === "b";
      // @ts-expect-error
      z.literalsUnion === "x";
    })
  );
});

describe("literals unions", () => {
  const req = {
    nullableField: {
      x: 1,
      optional: 1,
    },
  };
  const z = {} ;
  test(
    "accessible",
    dontExecute(() => {
      z.nullableField.x;
      _optionalChain([z, 'access', _44 => _44.nullableField, 'access', _45 => _45.optional, 'optionalAccess', _46 => _46.big]);
      // @ts-expect-error optional
      z.nullableField.optional.big;
    })
  );
});

test(
  "complex optional type with array",
  dontExecute(() => {
    

























    const x = {} ;
    _optionalChain([x, 'optionalAccess', _47 => _47.edges, 'optionalAccess', _48 => _48[0], 'optionalAccess', _49 => _49.node, 'optionalAccess', _50 => _50.x, 'optionalAccess', _51 => _51.toLocaleLowerCase]);
    // @ts-expect-error not present
    _optionalChain([x, 'optionalAccess', _52 => _52.edges, 'optionalAccess', _53 => _53[0], 'optionalAccess', _54 => _54.node, 'optionalAccess', _55 => _55.y, 'optionalAccess', _56 => _56.toLocaleLowerCase]);
    _optionalChain([x, 'optionalAccess', _57 => _57.edges, 'optionalAccess', _58 => _58[0], 'optionalAccess', _59 => _59.nodes, 'optionalAccess', _60 => _60[0], 'access', _61 => _61.x, 'optionalAccess', _62 => _62.toLocaleLowerCase]);
    _optionalChain([x, 'optionalAccess', _63 => _63.edges, 'optionalAccess', _64 => _64[0], 'optionalAccess', _65 => _65.nodes, 'optionalAccess', _66 => _66[0], 'access', _67 => _67.y, 'optionalAccess', _68 => _68.toLocaleLowerCase]);
  })
);

///////////////////////////////////// unions

// {
//     // only one union
//     type One = { one: string; __typename: string }
//     type Two = { two: string; __typename: string }
//     type SRC = {
//         union?: {
//             __union: One | Two
//             __resolve: {
//                 on_One: One
//                 on_Two: Two
//             }
//             __typename: 'One' | 'Two'
//         }
//     }
//     type DST = {
//         union?: {
//             on_One: {
//                 one: true
//             }
//             // on_Two: {
//             //     two: 1
//             // }
//         }
//     }
//     const z: FieldsSelection<SRC, DST> = {} as any
//     z.union?.one
// }

// {
//     // 2 unions together
//     type One = { one: string; __typename: string }
//     type Two = { two: string; __typename: string }
//     type SRC = {
//         union?: {
//             __union: One | Two
//             __resolve: {
//                 on_One: One
//                 on_Two: Two
//             }
//             __typename: 'One' | 'Two'
//         }
//     }
//     type DST = {
//         union?: {
//             on_One?: {
//                 one?: true
//             }
//             on_Two?: {
//                 two?: true
//             }
//         }
//     }
//     const z: FieldsSelection<SRC, DST> = {} as any
//     z.union // this is a union type, it cannot be directly be accessed without a guard
// }

// {
//     // without top level object
//     type One = { one?: string; __typename?: string }
//     type Two = { two?: string; __typename?: string }
//     type SRC = {
//         __union: One | Two
//         __resolve: {
//             on_One?: One
//             on_Two?: Two
//         }
//         __typename?: 'One' | 'Two'
//     }
//     type DST = {
//         on_One?: {
//             one?: true
//         }
//         __typename?: 1
//         // on_Two: {
//         //     two: 1
//         // }
//     }
//     const z: FieldsSelection<SRC, DST> = {} as any
//     z.one
// }

// {
//     type One = { one: string; __typename: string }
//     const x: ObjectFieldsSelection<One, { one?: true }> = {} as any
//     x.one
// }

function dontExecute(f) {
  return () => {};
}
