/// <reference path="typings/css/css.d.ts" />

import * as css from "css";
import {
  OrderedStringSet,
  flatMap,
  cut,
  isEmpty,
} from "./collection_utils";
import {collectRuleNodes} from "./css_utils";

export interface OrderDiffResult {
  [selector: string]: {
    uptrends: css.Selector[];
    downtrends: css.Selector[];
  };
}

export function orderDiff(a: css.StyleSheet, b: css.StyleSheet): OrderDiffResult {
  const selectorsA = new OrderedStringSet(flatMap(collectRuleNodes(a), (ruleNode) => ruleNode.selectors));
  const selectorsB = new OrderedStringSet(flatMap(collectRuleNodes(b), (ruleNode) => ruleNode.selectors));

  const commonSelectorsA = selectorsA.intersection(selectorsB).toArray();
  const commonSelectorsB = selectorsB.intersection(selectorsA).toArray();

  return orderDiffImpl(commonSelectorsA, commonSelectorsB);
}

function orderDiffImpl(selectorsA: css.Selector[], selectorsB: css.Selector[]): OrderDiffResult {
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
