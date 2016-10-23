import * as assert from "assert";
import * as css from "css";
import {orderDiff, OrderDiffResult} from "../order_diff";
import {keys} from "../collection_utils";

describe("orderDiff", () => {
  it("should return empty result when no differences exist between specified 2 StyleSheets", () => {
    const styleSheetA = css.parse("a {} b {}");
    const styleSheetB = css.parse("a {} b {}");

    const results = orderDiff(styleSheetA, styleSheetB);

    assertDiffHasSelectors(results, []);
  });

  it("should return empty result when no common rules exist between specified 2 StyleSheets", () => {
    const styleSheetA = css.parse("a {}");
    const styleSheetB = css.parse("b {}");

    const results = orderDiff(styleSheetA, styleSheetB);

    assertDiffHasSelectors(results, []);
  });

  it("should return selectors with the uptrend selectors and downtrend selectors " +
     "when the difference exist between specified 2 StyleSheets", () => {
    const styleSheetA = css.parse("a {} b {}");
    const styleSheetB = css.parse("b {} a {}");

    const results = orderDiff(styleSheetA, styleSheetB);

    assertDiffHasSelectors(results, ["a", "b"]);

    const resultForA = results["a"];
    assert.deepEqual(resultForA, { uptrends: ["b"], downtrends: [] });

    const resultForB = results["b"];
    assert.deepEqual(resultForB, { uptrends: [], downtrends: ["a"] });
  });

  it("should return only changed selectors with the uptrend selectors and " +
     "downtrend selectors when the difference exist between specified 2 StyleSheets", () => {
    const styleSheetA = css.parse("a {} b {} c {}");
    const styleSheetB = css.parse("b {} a {} c {}");

    const results = orderDiff(styleSheetA, styleSheetB);

    assertDiffHasSelectors(results, ["a", "b"]);

    const resultForA = results["a"];
    assert.deepEqual(resultForA, { uptrends: ["b"], downtrends: [] });

    const resultForB = results["b"];
    assert.deepEqual(resultForB, { uptrends: [], downtrends: ["a"] });
  });
});


function assertDiffHasSelectors(results: OrderDiffResult, selectors: string[]): void {
  assert.deepEqual(keys(results), selectors);
}
