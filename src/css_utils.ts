/// <reference path="typings/bundle.d.ts" />
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
  return hashNode(nodeA) === hashNode(nodeB);
}

export function hashNode(node: css.Node): string {
  return css.stringify(createDummyStyleSheet(node), { compress: true });
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
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(css.parse(data, { source: filePath }));
    });
  });
}

export function createDummyStyleSheet(node: css.Node): css.StyleSheet {
  const parsingErrors: Error[] = [];
  return {
    type: "stylesheet",
    stylesheet: {
      rules: [node],
      parsingErrors,
    },
  };
}

export class NodeSet {
  private store: { [id: string]: css.Node } = {};
  private nodes: css.Node[] = [];

  constructor(nodes: css.Node[] = []) {
    nodes.forEach((node) => this.add(node));
  }

  public sub(set: NodeSet): NodeSet {
    return new NodeSet(flatMap(this.nodes, (node) => set.contains(node) ? [] : [node]));
  }

  public add(node: css.Node): void {
    const hash = hashNode(node);
    this.store[hash] = node;
    this.nodes.push(node);
  }

  public contains(node: css.Node): boolean {
    const hash = hashNode(node);
    return hash in this.store;
  }

  public toArray(): css.Node[] {
    return [].concat(this.nodes);
  }
}
