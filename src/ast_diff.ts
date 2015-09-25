/// <reference path="typings/css/css.d.ts" />

import css = require("css");
import {
  flatMap,
  values,
  isEmpty,
} from "./collection_utils";
import {
  collectRuleNodes,
  uniformNode,
  getNodeId,
  nodeEquals,
} from "./css_utils";

type AstDiff = {
  changed: boolean;
  extra: css.Node[];
  missing: css.Node[];
};

export function astDiff(a: css.StyleSheet, b: css.StyleSheet): AstDiff {
  const ruleNodesA = collectRuleNodes(a);
  const ruleNodesB = collectRuleNodes(b);
  return astDiffImpl(ruleNodesA, ruleNodesB);
}

function astDiffImpl(nodesA: css.Node[], nodesB: css.Node[]): AstDiff {
  const missingNodeMap: { [id: string]: css.Node } = {};
  let extraNodes: css.Node[];

  const uniformedNodesA = flatMap(nodesA, uniformNode);
  const uniformedNodesB = flatMap(nodesB, uniformNode);

  let nodeA: css.Node;
  let nodeB: css.Node;

  while (!isEmpty(uniformedNodesA) || !isEmpty(uniformedNodesB)) {
    if (isEmpty(uniformedNodesB)) {
      extraNodes = uniformedNodesA;
      break;
    }

    nodeB = uniformedNodesB.shift();

    let nodeIdB = getNodeId(nodeB);
    if (nodeIdB in missingNodeMap) {
      delete missingNodeMap[nodeIdB];
      continue;
    }

    nodeA = uniformedNodesA.shift();

    if (!nodeEquals(nodeA, nodeB)) {
      missingNodeMap[nodeIdB] = nodeB;
      continue;
    }
  }

  const missingNodes = values(missingNodeMap);

  return {
    changed: !(isEmpty(missingNodes) && isEmpty(extraNodes)),
    extra: extraNodes || [],
    missing: missingNodes,
  };
}
