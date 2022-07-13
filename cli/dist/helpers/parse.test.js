"use strict";var _parse = require('./parse');

describe("parse empty", () => {
  test("undefined", () => {
    const header = _parse.parseColonSeparatedStrings.call(void 0, );
    expect(header).toEqual({});
  });
  test("empty array", () => {
    const header = _parse.parseColonSeparatedStrings.call(void 0, []);
    expect(header).toEqual({});
  });
});

describe("header parsing", () => {
  test("Bearer Token", () => {
    const header = _parse.parseColonSeparatedStrings.call(void 0, ["Authorization: Bearer 1234"]);
    expect(header).toEqual({
      Authorization: "Bearer 1234",
    });
  });

  test("Referer", () => {
    const header = _parse.parseColonSeparatedStrings.call(void 0, ["Referer: https://www.xyz.com"]);
    expect(header).toEqual({
      Referer: "https://www.xyz.com",
    });
  });

  test("Multiple", () => {
    const header = _parse.parseColonSeparatedStrings.call(void 0, ["Referer: https://www.xyz.com", "Accept: application/json"]);
    expect(header).toEqual({ Accept: "application/json", Referer: "https://www.xyz.com" });
  });
});

describe("scalar parsing", () => {
  test("DateTime:string", () => {
    const scalar = _parse.parseColonSeparatedStrings.call(void 0, ["DateTime:string"]);
    expect(scalar).toEqual({
      DateTime: "string",
    });
  });
});
