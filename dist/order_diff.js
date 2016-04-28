/// <reference path="typings/css/css.d.ts" />
"use strict";
var collection_utils_1 = require("./collection_utils");
var css_utils_1 = require("./css_utils");
function orderDiff(a, b) {
    var selectorsA = new collection_utils_1.OrderedStringSet(collection_utils_1.flatMap(css_utils_1.collectRuleNodes(a), function (ruleNode) { return ruleNode.selectors; }));
    var selectorsB = new collection_utils_1.OrderedStringSet(collection_utils_1.flatMap(css_utils_1.collectRuleNodes(b), function (ruleNode) { return ruleNode.selectors; }));
    var commonSelectorsA = selectorsA.intersection(selectorsB).toArray();
    var commonSelectorsB = selectorsB.intersection(selectorsA).toArray();
    return orderDiffImpl(commonSelectorsA, commonSelectorsB);
}
exports.orderDiff = orderDiff;
function orderDiffImpl(selectorsA, selectorsB) {
    if (selectorsA.length !== selectorsB.length) {
        throw new Error("Lengths of two selectors must be equivalent: " + selectorsA.length + " !== " + selectorsB.length);
    }
    var result = {};
    selectorsA.forEach(function (selectorA, indexA) {
        var indexB = selectorsB.indexOf(selectorA);
        if (indexB < 0) {
            throw new Error("Two selectors must be contains same selectors: missing " + selectorA);
        }
        var _a = collection_utils_1.cut(indexA, selectorsA), highersBefore = _a[0], lowersBefore = _a[1];
        var _b = collection_utils_1.cut(indexB, selectorsB), highersAfter = _b[0], lowersAfter = _b[1];
        var uptrends = new collection_utils_1.OrderedStringSet(highersAfter)
            .sub(new collection_utils_1.OrderedStringSet(highersBefore))
            .toArray();
        var downtrends = new collection_utils_1.OrderedStringSet(lowersAfter)
            .sub(new collection_utils_1.OrderedStringSet(lowersBefore))
            .toArray();
        if (!(collection_utils_1.isEmpty(uptrends) && collection_utils_1.isEmpty(downtrends))) {
            result[selectorA] = {
                uptrends: uptrends,
                downtrends: downtrends,
            };
        }
    });
    return result;
}
//# sourceMappingURL=order_diff.js.map