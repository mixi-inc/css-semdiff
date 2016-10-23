import * as Fs from "fs";
import * as css from "css";
import {flatMap} from "./collection_utils";


export function collectRuleNodes(styleSheet: css.Stylesheet): css.Rule[] {
  return flatMap(styleSheet.stylesheet.rules,
      (node) => isRuleNode(node) ? [node] : []);
}


/**
 * Whether the first node is equivalent to the second one.
 * This comparison is based on their hash values.
 * @see hashNode
 */
export function nodeEquals(nodeA: css.Node, nodeB: css.Node): boolean {
  return hashNode(nodeA) === hashNode(nodeB);
}


/**
 * Returns a hash value of the given node.
 *
 * The hash value should unique to css properties contained.
 * It means, following examples A and B should have the same hash value.
 *
 *     - Example A: { color: red; }
 *     - Example B: {\ncolor:red;\n}
 */
export function hashNode(node: css.Node): string {
  return css.stringify(createDummyStyleSheet(node), { compress: true });
}


/**
 * Returns nodes that separated a slector group by their selectors.
 * We can equate the selector group 'a, b { ... }' to
 * the group 'b, a { ... }' and the group 'a { ... } b { ... }'.
 *
 * For example the selector group is like following:
 *
 *     a, b { color: red; }
 *
 * this function transform it to:
 *
 *     a { color: red; }
 *     b { color: red; }
 */
export function uniformNode(node: css.Node): css.Node[] {
  if (isRuleNode(node)) {
    return uniformRuleNode(node);
  }
  else {
    return [node];
  }
}


function uniformRuleNode(ruleNode: css.Rule): css.Rule[] {
  return ruleNode.selectors.map((selector) => ({
    type: ruleNode.type,
    parent: ruleNode.parent,
    position: ruleNode.position,
    selectors: [selector],
    declarations: ruleNode.declarations,
  }));
}


export function isRuleNode(node: css.Node): node is css.Rule {
  return node.type === "rule";
}


export function parseFile(filePath: string): Promise<css.Stylesheet> {
  return new Promise((resolve, reject) => {
    Fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(css.parse(data, { source: filePath }));
    });
  });
}


export function stringifyCssNode(node: css.Node): string {
  // XXX: css.stringify can support only css.StyleSheet.
  //      So, we should create a dummy css.Stylesheet that
  //      have only a node to stringify.
  return css.stringify(createDummyStyleSheet(node));
}


export function createDummyStyleSheet(node: css.Node): css.Stylesheet {
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
    if (hash in this.store) { return; }
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
