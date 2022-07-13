"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parse_1 = require("./parse");
describe("parse empty", () => {
    test("undefined", () => {
        const header = (0, parse_1.parseColonSeparatedStrings)();
        expect(header).toEqual({});
    });
    test("empty array", () => {
        const header = (0, parse_1.parseColonSeparatedStrings)([]);
        expect(header).toEqual({});
    });
});
describe("header parsing", () => {
    test("Bearer Token", () => {
        const header = (0, parse_1.parseColonSeparatedStrings)(["Authorization: Bearer 1234"]);
        expect(header).toEqual({
            Authorization: "Bearer 1234",
        });
    });
    test("Referer", () => {
        const header = (0, parse_1.parseColonSeparatedStrings)(["Referer: https://www.xyz.com"]);
        expect(header).toEqual({
            Referer: "https://www.xyz.com",
        });
    });
    test("Multiple", () => {
        const header = (0, parse_1.parseColonSeparatedStrings)(["Referer: https://www.xyz.com", "Accept: application/json"]);
        expect(header).toEqual({ Accept: "application/json", Referer: "https://www.xyz.com" });
    });
});
describe("scalar parsing", () => {
    test("DateTime:string", () => {
        const scalar = (0, parse_1.parseColonSeparatedStrings)(["DateTime:string"]);
        expect(scalar).toEqual({
            DateTime: "string",
        });
    });
});
//# sourceMappingURL=parse.test.js.map