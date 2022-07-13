"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _commontags = require('common-tags');

var _comment = require('../comment');

 const stripAndWrap = (tsa) => `\n${_commontags.stripIndent.call(void 0, tsa)}\n`; exports.stripAndWrap = stripAndWrap;

test("deprecated", () => {
  expect(_comment.comment.call(void 0, { deprecated: "deprecation reason" })).toBe(exports.stripAndWrap`
    /** @deprecated deprecation reason */
  `);
});

test("deprecated multiline", () => {
  expect(_comment.comment.call(void 0, { deprecated: "deprecation\nreason\nmultiline" })).toBe(exports.stripAndWrap`
    /** @deprecated deprecation reason multiline */
  `);
});

test("single line", () => {
  expect(_comment.comment.call(void 0, { text: "single line" })).toBe(exports.stripAndWrap`
    /** single line */
    `);
});

test("single line deprecated", () => {
  expect(_comment.comment.call(void 0, { text: "single line", deprecated: "deprecation reason" })).toBe(exports.stripAndWrap`
    /**
     * @deprecated deprecation reason
     * single line
     */
  `);
});

test("multiline", () => {
  expect(_comment.comment.call(void 0, { text: "multiline\ntext" })).toBe(exports.stripAndWrap`
    /**
     * multiline
     * text
     */
  `);
});

test("multiline deprecated", () => {
  expect(_comment.comment.call(void 0, { text: "multiline\ntext", deprecated: "deprecation reason" })).toBe(exports.stripAndWrap`
    /**
     * @deprecated deprecation reason
     * multiline
     * text
     */
  `);
});
