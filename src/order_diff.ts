import * as css from "css";
import {
  OrderedStringSet,
  flatMap,
  cut,
  isEmpty,
} from "./collection_utils";
import {collectRuleNodes} from "./css_utils";
import {NoSelectorsError} from "./error";

export interface OrderDiffResult {
  [selector: string]: {
    uptrends: string[];
    downtrends: string[];
  };
}

export function orderDiff(a: css.Stylesheet, b: css.Stylesheet): OrderDiffResult {
  const selectorsA = new OrderedStringSet(flatMap(collectRuleNodes(a), getSelectorsByRuleNode));
  const selectorsB = new OrderedStringSet(flatMap(collectRuleNodes(b), getSelectorsByRuleNode));

  const commonSelectorsA = selectorsA.intersection(selectorsB).toArray();
  const commonSelectorsB = selectorsB.intersection(selectorsA).toArray();

  return orderDiffImpl(commonSelectorsA, commonSelectorsB);
}

function getSelectorsByRuleNode(ruleNode: css.Rule): string[] {
  if (!ruleNode.selectors) throw NoSelectorsError.causedBy("the given one");
  return ruleNode.selectors;
}

function orderDiffImpl(selectorsA: string[], selectorsB: string[]): OrderDiffResult {
  if (selectorsA.length !== selectorsB.length) {
    throw new Error(`Lengths of two selectors must be equivalent: ${selectorsA.length} !== ${selectorsB.length}`);
  }

  const result: OrderDiffResult = {};

  selectorsA.forEach((selectorA, indexA) => {
    const indexB = selectorsB.indexOf(selectorA);
    if (indexB < 0) {
      throw new Error(`Two selectors must be contains same selectors: missing ${selectorA}`);
    }

    const [highersBefore, lowersBefore] = cut(indexA, selectorsA);
    const [highersAfter, lowersAfter] = cut(indexB, selectorsB);

    const uptrends = new OrderedStringSet(highersAfter)
      .sub(new OrderedStringSet(highersBefore))
      .toArray();

    const downtrends = new OrderedStringSet(lowersAfter)
      .sub(new OrderedStringSet(lowersBefore))
      .toArray();

    if (!(isEmpty(uptrends) && isEmpty(downtrends))) {
      result[selectorA] = {
        uptrends,
        downtrends,
      };
    }
  });

  return result;
}
