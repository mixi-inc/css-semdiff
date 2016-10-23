import * as assert from "assert";
import * as css from "css";
import {astDiff} from "./ast_diff";

describe("astDiff", () => {
  it("should return result that represents 'no changed' when there are no changed between 2 StyleSheets", () => {
    const styleSheetA = css.parse("a { display: none; }");
    const styleSheetB = css.parse("a { display: none; }");

    const result = astDiff(styleSheetA, styleSheetB);
    assert(!result.changed);
  });

  it("should return extra nodes when the last StyleSheet has an extra node", () => {
    const styleSheetA = css.parse("");
    const styleSheetB = css.parse(".extra { display: none; }");

    const result = astDiff(styleSheetA, styleSheetB);
    assert(result.changed);

    assert.strictEqual(result.extra.length, 1);
    assertRuleNodeEqual(result.extra[0], [".extra"]);

    assert.deepEqual(result.missing, []);
  });

  it("should return missing nodes when the first StyleSheet has an extra node", () => {
    const styleSheetA = css.parse(".missing { display: none; }");
    const styleSheetB = css.parse("");

    const result = astDiff(styleSheetA, styleSheetB);
    assert(result.changed);

    assert.deepEqual(result.extra, []);

    assert.strictEqual(result.missing.length, 1);
    assertRuleNodeEqual(result.missing[0], [".missing"]);
  });

  it("should return extra and missing nodes when the both 2 StyleSheet have an extra node", () => {
    const styleSheetA = css.parse(".missing { display: none; }");
    const styleSheetB = css.parse(".extra { display: none; }");

    const result = astDiff(styleSheetA, styleSheetB);
    assert(result.changed);

    assert.strictEqual(result.extra.length, 1);
    assertRuleNodeEqual(result.extra[0], [".extra"]);

    assert.strictEqual(result.missing.length, 1);
    assertRuleNodeEqual(result.missing[0], [".missing"]);
  });

  it("should return extra and missing nodes when the both 2 StyleSheet have an extra node and several common nodes", () => {
    const styleSheetA = css.parse(".missing { display: none; } .common { display: none; }");
    const styleSheetB = css.parse(".extra { display: none; } .common { display: none; }");

    const result = astDiff(styleSheetA, styleSheetB);
    assert(result.changed);

    assert.strictEqual(result.extra.length, 1);
    assertRuleNodeEqual(result.extra[0], [".extra"]);

    assert.strictEqual(result.missing.length, 1);
    assertRuleNodeEqual(result.missing[0], [".missing"]);
  });
});


function assertNodeTypeEqual(node: css.Node, nodeType: string): void {
  assert.strictEqual(node.type, nodeType);
}

function assertRuleNodeEqual(node: css.Node, selectors: string[]): void {
  assertNodeTypeEqual(node, "rule");
  const ruleNode = <css.Rule>node;
  assert.deepEqual(ruleNode.selectors, selectors);
}
