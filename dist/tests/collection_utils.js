/// <reference path="../typings/bundle.d.ts" />
"use strict";
var assert = require("assert");
var collection_utils_1 = require("../collection_utils");
describe("OrderedStringSet", function () {
    describe("#union", function () {
        it("should return an empty array when given are both empty", function () {
            var setA = new collection_utils_1.OrderedStringSet();
            var setB = new collection_utils_1.OrderedStringSet();
            assert.deepEqual(setA.union(setB).toArray(), []);
        });
        it("should return an array includes the member twice when given arrays both have the member", function () {
            var setA = new collection_utils_1.OrderedStringSet(["1"]);
            var setB = new collection_utils_1.OrderedStringSet(["1"]);
            assert.deepEqual(setA.union(setB).toArray(), ["1"]);
        });
        it("should return an array includes all members when the given arrays have exclusive members", function () {
            var setA = new collection_utils_1.OrderedStringSet(["2"]);
            var setB = new collection_utils_1.OrderedStringSet(["3"]);
            assert.deepEqual(setA.union(setB).toArray(), ["2", "3"]);
        });
        it("should return an array includes all members when either array", function () {
            var setA = new collection_utils_1.OrderedStringSet(["1", "2"]);
            var setB = new collection_utils_1.OrderedStringSet(["1", "3"]);
            assert.deepEqual(setA.union(setB).toArray(), ["1", "2", "3"]);
        });
    });
    describe("#intersection", function () {
        it("should return an empty array when given are both empty", function () {
            var setA = new collection_utils_1.OrderedStringSet();
            var setB = new collection_utils_1.OrderedStringSet();
            assert.deepEqual(setA.intersection(setB).toArray(), []);
        });
        it("should return an array includes the members when both given arrays have same members", function () {
            var setA = new collection_utils_1.OrderedStringSet(["1"]);
            var setB = new collection_utils_1.OrderedStringSet(["1"]);
            assert.deepEqual(setA.intersection(setB).toArray(), ["1"]);
        });
        it("should return an empty array when the given arrays have only exclusive members", function () {
            var setA = new collection_utils_1.OrderedStringSet(["2"]);
            var setB = new collection_utils_1.OrderedStringSet(["3"]);
            assert.deepEqual(setA.intersection(setB).toArray(), []);
        });
        it("should return an array includes only members that are included by both arrays", function () {
            var setA = new collection_utils_1.OrderedStringSet(["1", "2"]);
            var setB = new collection_utils_1.OrderedStringSet(["1", "3"]);
            assert.deepEqual(setA.intersection(setB).toArray(), ["1"]);
        });
    });
    describe("#contains", function () {
        it("should return false when the set does not contain the specified string", function () {
            var set = new collection_utils_1.OrderedStringSet();
            assert(!set.contains("1"));
        });
        it("should return true when the set contains the specified string", function () {
            var set = new collection_utils_1.OrderedStringSet(["1", "2", "3"]);
            assert(set.contains("1"));
        });
    });
});
