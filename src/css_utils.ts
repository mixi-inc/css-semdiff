/// <reference path="typings/css/css.d.ts" />

import fs = require("fs");
import es6Promise = require("es6-promise");
const {Promise} = es6Promise;
import css = require("css");
import {flatMap} from "./collection_utils";

export function collectRuleNodes(styleSheet: css.StyleSheet): css.RuleNode[] {
  return flatMap(styleSheet.stylesheet.rules,
      (node) => isRuleNode(node) ? [node] : []);
}

export function nodeEquals(nodeA: css.Node, nodeB: css.Node): boolean {
  return getNodeId(nodeA) === getNodeId(nodeB);
}

export function getNodeId(node: css.Node): string {
  return JSON.stringify(node);
}

export function uniformNode(node: css.Node): css.Node[] {
  if (isRuleNode(node)) {
    return uniformRuleNode(node);
  }
  else {
    return [node];
  }
}

function uniformRuleNode(ruleNode: css.RuleNode): css.RuleNode[] {
  return ruleNode.selectors.map((selector) => ({
    type: ruleNode.type,
    parent: ruleNode.parent,
    position: ruleNode.position,
    selectors: [selector],
    declarations: ruleNode.declarations,
  }));
}

export function isRuleNode(node: css.Node): node is css.RuleNode {
  return node.type === "rule";
}

export function parseFiles(filePathA: string, filePathB: string): Promise<[css.StyleSheet, css.StyleSheet]> {
  return Promise.all([parseFile(filePathA), parseFile(filePathB)]);
}

export function parseFile(filePath: string): Promise<css.StyleSheet> {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(css.parse(data, { source: filePath }));
    });
  });
}
