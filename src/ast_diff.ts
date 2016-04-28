/// <reference path="typings/css/css.d.ts" />

import * as css from "css";

import {
  flatMap,
  isEmpty,
} from "./collection_utils";
import {
  uniformNode,
  NodeSet,
} from "./css_utils";

export interface AstDiffResult {
  changed: boolean;
  extra: css.Node[];
  missing: css.Node[];
}

export function astDiff(a: css.StyleSheet, b: css.StyleSheet): AstDiffResult {
  return astDiffImpl(a.stylesheet.rules, b.stylesheet.rules);
}

function astDiffImpl(nodesA: css.Node[], nodesB: css.Node[]): AstDiffResult {
  const uniformedNodesA = flatMap(nodesA, uniformNode);
  const uniformedNodesB = flatMap(nodesB, uniformNode);

  if (isEmpty(uniformedNodesA)) {
    return {
      changed: true,
      missing: [],
      extra: uniformedNodesB,
    };
  }

  if (isEmpty(uniformedNodesB)) {
    return {
      changed: true,
      missing: uniformedNodesA,
      extra: [],
    };
  }

  const nodeSetA = new NodeSet(uniformedNodesA);
  const nodeSetB = new NodeSet(uniformedNodesB);

  const missingNodes = nodeSetA.sub(nodeSetB).toArray();
  const extraNodes = nodeSetB.sub(nodeSetA).toArray();

  return {
    changed: !(isEmpty(missingNodes) && isEmpty(extraNodes)),
    missing: missingNodes,
    extra: extraNodes,
  };
}
