"use strict";var _prettify = require('../../../helpers/prettify');
var _RenderContext = require('../RenderContext');

describe("RenderContext", () => {
  test("prettify", () => {
    const ctx = new (0, _RenderContext.RenderContext)();
    ctx.addCodeBlock("interface A{}");
    expect(ctx.toCode("typescript", true)).toBe(_prettify.prettify.call(void 0, `interface A{}`, "typescript"));
  });

  test("raw", () => {
    const ctx = new (0, _RenderContext.RenderContext)();
    ctx.addCodeBlock("raw string");
    expect(ctx.toCode()).toBe("raw string");
  });
});
