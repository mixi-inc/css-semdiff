import * as css from "css";

import {
  flatMap,
  isEmpty,
} from "./collection_utils";
import {
  uniformNode,
  NodeSet,
} from "./css_utils";
import {NoRulesError} from "./error";

export interface AstDiffResult {
  changed: boolean;
  extra: css.Node[];
  missing: css.Node[];
}

export function astDiff(a: css.Stylesheet, b: css.Stylesheet): AstDiffResult {
  if (!(a.stylesheet && a.stylesheet.rules)) throw NoRulesError.causedByFirst();
  if (!(b.stylesheet && b.stylesheet.rules)) throw NoRulesError.causedBySecond();

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
