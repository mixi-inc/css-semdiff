/// <reference path="typings/css/css.d.ts" />
"use strict";
var collection_utils_1 = require("./collection_utils");
var css_utils_1 = require("./css_utils");
function astDiff(a, b) {
    return astDiffImpl(a.stylesheet.rules, b.stylesheet.rules);
}
exports.astDiff = astDiff;
function astDiffImpl(nodesA, nodesB) {
    var uniformedNodesA = collection_utils_1.flatMap(nodesA, css_utils_1.uniformNode);
    var uniformedNodesB = collection_utils_1.flatMap(nodesB, css_utils_1.uniformNode);
    if (collection_utils_1.isEmpty(uniformedNodesA)) {
        return {
            changed: true,
            missing: [],
            extra: uniformedNodesB,
        };
    }
    if (collection_utils_1.isEmpty(uniformedNodesB)) {
        return {
            changed: true,
            missing: uniformedNodesA,
            extra: [],
        };
    }
    var nodeSetA = new css_utils_1.NodeSet(uniformedNodesA);
    var nodeSetB = new css_utils_1.NodeSet(uniformedNodesB);
    var missingNodes = nodeSetA.sub(nodeSetB).toArray();
    var extraNodes = nodeSetB.sub(nodeSetA).toArray();
    return {
        changed: !(collection_utils_1.isEmpty(missingNodes) && collection_utils_1.isEmpty(extraNodes)),
        missing: missingNodes,
        extra: extraNodes,
    };
}
