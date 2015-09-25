/// <reference path="../typings/bundle.d.ts" />

import assert = require("assert");
import {OrderedStringSet} from "../collection_utils";

describe("OrderedStringSet", () => {
  describe("#union", () => {
    it("should return an empty array when given are both empty", () => {
      const setA = new OrderedStringSet();
      const setB = new OrderedStringSet();
      assert.deepEqual(setA.union(setB).toArray(), []);
    });

    it("should return an array includes the member twice when given arrays both have the member", () => {
      const setA = new OrderedStringSet(["1"]);
      const setB = new OrderedStringSet(["1"]);
      assert.deepEqual(setA.union(setB).toArray(), ["1"]);
    });

    it("should return an array includes all members when the given arrays have exclusive members", () => {
      const setA = new OrderedStringSet(["2"]);
      const setB = new OrderedStringSet(["3"]);
      assert.deepEqual(setA.union(setB).toArray(), ["2", "3"]);
    });

    it("should return an array includes all members when either array", () => {
      const setA = new OrderedStringSet(["1", "2"]);
      const setB = new OrderedStringSet(["1", "3"]);
      assert.deepEqual(setA.union(setB).toArray(), ["1", "2", "3"]);
    });
  });

  describe("#intersection", () => {
    it("should return an empty array when given are both empty", () => {
      const setA = new OrderedStringSet();
      const setB = new OrderedStringSet();
      assert.deepEqual(setA.intersection(setB).toArray(), []);
    });

    it("should return an array includes the members when both given arrays have same members", () => {
      const setA = new OrderedStringSet(["1"]);
      const setB = new OrderedStringSet(["1"]);
      assert.deepEqual(setA.intersection(setB).toArray(), ["1"]);
    });

    it("should return an empty array when the given arrays have only exclusive members", () => {
      const setA = new OrderedStringSet(["2"]);
      const setB = new OrderedStringSet(["3"]);
      assert.deepEqual(setA.intersection(setB).toArray(), []);
    });

    it("should return an array includes only members that are included by both arrays", () => {
      const setA = new OrderedStringSet(["1", "2"]);
      const setB = new OrderedStringSet(["1", "3"]);
      assert.deepEqual(setA.intersection(setB).toArray(), ["1"]);
    });
  });

  describe("#contains", () => {
    it("should return false when the set does not contain the specified string", () => {
      const set = new OrderedStringSet();
      assert(!set.contains("1"));
    });

    it("should return true when the set contains the specified string", () => {
      const set = new OrderedStringSet(["1", "2", "3"]);
      assert(set.contains("1"));
    });
  });
});
