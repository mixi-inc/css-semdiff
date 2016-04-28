/// <reference path="../typings/bundle.d.ts" />
/// <reference path="../typings/css/css.d.ts" />

import * as assert from "assert";
import * as css from "css";
import {NodeSet} from "../css_utils";

describe("NodeSet", () => {
  describe("#constructor", () => {
    it("should return an empty set when no args", () => {
      const set = new NodeSet();
      assertSetEqual(set, []);
    });

    it("should return a set has a node when the node specified", () => {
      const node = createRuleNodeA();
      const set = new NodeSet([node]);
      assertSetEqual(set, [node]);
    });

    it("should return a set has a node when the same node specified twice", () => {
      const nodeA = createRuleNodeA();
      const nodeB = createRuleNodeA();
      const set = new NodeSet([nodeA, nodeB]);
      assertSetEqual(set, [nodeA]);
    });

    it("should return a set has only the first node when two empty nodes specified " +
       "(NOTE: this behavior strongly depends css.stringify implementation)", () => {
      const nodeA = createNode("a {}");
      const nodeB = createNode("b {}");
      const set = new NodeSet([nodeA, nodeB]);
      assertSetEqual(set, [nodeA]);
    });

    it("should return a set has two nodes when two nodes specified", () => {
      const nodeA = createRuleNodeA();
      const nodeB = createRuleNodeB();
      const set = new NodeSet([nodeA, nodeB]);
      assertSetEqual(set, [nodeA, nodeB]);
    });

    it("should return a set has two nodes when two nodes specified", () => {
      const nodeA = createRuleNodeA();
      const nodeB = createRuleNodeB();
      const set = new NodeSet([nodeA, nodeB]);
      assertSetEqual(set, [nodeA, nodeB]);
    });
  });

  describe("#add", () => {
    it("should return a set has a node when the node added", () => {
      const node = createRuleNodeA();

      const set = new NodeSet();
      set.add(node);

      assertSetEqual(set, [node]);
    });

    it("should return a set has a node when the same node added twice", () => {
      const nodeA = createRuleNodeA();
      const nodeB = createRuleNodeA();

      const set = new NodeSet();
      set.add(nodeA);
      set.add(nodeB);

      assertSetEqual(set, [nodeA]);
    });

    it("should return a set has only the first node when two empty nodes added " +
       "(NOTE: this behavior strongly depends css.stringify implementation)", () => {
      const nodeA = createNode("a {}");
      const nodeB = createNode("b {}");

      const set = new NodeSet();
      set.add(nodeA);
      set.add(nodeB);

      assertSetEqual(set, [nodeA]);
    });

    it("should return a set has two nodes when two nodes added", () => {
      const nodeA = createRuleNodeA();
      const nodeB = createRuleNodeB();

      const set = new NodeSet();
      set.add(nodeA);
      set.add(nodeB);

      assertSetEqual(set, [nodeA, nodeB]);
    });

    it("should return a set has two nodes when two nodes added", () => {
      const nodeA = createRuleNodeA();
      const nodeB = createRuleNodeB();

      const set = new NodeSet();
      set.add(nodeA);
      set.add(nodeB);

      assertSetEqual(set, [nodeA, nodeB]);
    });
  });

  describe("#sub", () => {
    it("should return an empty set when specified two empty sets", () => {
      const setA = new NodeSet();
      const setB = new NodeSet();

      assertSetEqual(setA.sub(setB), []);
    });

    it("should return a set has only a node when specified the set has the node and an empty set", () => {
      const nodeA = createRuleNodeA();
      const setA = new NodeSet([nodeA]);
      const setB = new NodeSet();

      assertSetEqual(setA.sub(setB), [nodeA]);
    });

    it("should return an empty set when specified an empty set and a set has several nodes", () => {
      const nodeA = createRuleNodeA();
      const setA = new NodeSet();
      const setB = new NodeSet([nodeA]);

      assertSetEqual(setA.sub(setB), []);
    });

    it("should return an empty set when specified both sets have a same node", () => {
      const nodeA = createRuleNodeA();
      const setA = new NodeSet([nodeA]);
      const setB = new NodeSet([nodeA]);

      assertSetEqual(setA.sub(setB), []);
    });

    it("should return an empty set when specified both sets have several same nodes", () => {
      const nodeA = createRuleNodeA();
      const nodeB = createRuleNodeB();
      const setA = new NodeSet([nodeA, nodeB]);
      const setB = new NodeSet([nodeB, nodeA]);

      assertSetEqual(setA.sub(setB), []);
    });

    it("should return a set has only nodeB when specified a set has nodeA and nodeB, another set has nodeA", () => {
      const nodeA = createRuleNodeA();
      const nodeB = createRuleNodeB();
      const setA = new NodeSet([nodeA, nodeB]);
      const setB = new NodeSet([nodeA]);

      assertSetEqual(setA.sub(setB), [nodeB]);
    });
  });
});


function assertSetEqual(set: NodeSet, nodes: css.Node[]): void {
  assert.deepEqual(set.toArray(), nodes);
}

function createNode(cssText: string): css.Node {
  return css.parse(cssText).stylesheet.rules[0];
}

function createRuleNodeA(): css.Node {
  return createNode("a { display: none; }");
}

function createRuleNodeB(): css.Node {
  return createNode("b { display: none; }");
}
