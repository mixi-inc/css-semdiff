/// <reference path="typings/bundle.d.ts" />
/// <reference path="typings/css/css.d.ts" />
"use strict";
var fs = require("fs");
var es6Promise = require("es6-promise");
var Promise = es6Promise.Promise;
var css = require("css");
var collection_utils_1 = require("./collection_utils");
function collectRuleNodes(styleSheet) {
    return collection_utils_1.flatMap(styleSheet.stylesheet.rules, function (node) { return isRuleNode(node) ? [node] : []; });
}
exports.collectRuleNodes = collectRuleNodes;
function nodeEquals(nodeA, nodeB) {
    return hashNode(nodeA) === hashNode(nodeB);
}
exports.nodeEquals = nodeEquals;
function hashNode(node) {
    return css.stringify(createDummyStyleSheet(node), { compress: true });
}
exports.hashNode = hashNode;
function uniformNode(node) {
    if (isRuleNode(node)) {
        return uniformRuleNode(node);
    }
    else {
        return [node];
    }
}
exports.uniformNode = uniformNode;
function uniformRuleNode(ruleNode) {
    return ruleNode.selectors.map(function (selector) { return ({
        type: ruleNode.type,
        parent: ruleNode.parent,
        position: ruleNode.position,
        selectors: [selector],
        declarations: ruleNode.declarations,
    }); });
}
function isRuleNode(node) {
    return node.type === "rule";
}
exports.isRuleNode = isRuleNode;
function parseFiles(filePathA, filePathB) {
    return Promise.all([parseFile(filePathA), parseFile(filePathB)]);
}
exports.parseFiles = parseFiles;
function parseFile(filePath) {
    return new Promise(function (resolve, reject) {
        fs.readFile(filePath, "utf8", function (err, data) {
            if (err) {
                reject(err);
                return;
            }
            resolve(css.parse(data, { source: filePath }));
        });
    });
}
exports.parseFile = parseFile;
function createDummyStyleSheet(node) {
    var parsingErrors = [];
    return {
        type: "stylesheet",
        stylesheet: {
            rules: [node],
            parsingErrors: parsingErrors,
        },
    };
}
exports.createDummyStyleSheet = createDummyStyleSheet;
var NodeSet = (function () {
    function NodeSet(nodes) {
        var _this = this;
        if (nodes === void 0) { nodes = []; }
        this.store = {};
        this.nodes = [];
        nodes.forEach(function (node) { return _this.add(node); });
    }
    NodeSet.prototype.sub = function (set) {
        return new NodeSet(collection_utils_1.flatMap(this.nodes, function (node) { return set.contains(node) ? [] : [node]; }));
    };
    NodeSet.prototype.add = function (node) {
        var hash = hashNode(node);
        if (hash in this.store) {
            return;
        }
        this.store[hash] = node;
        this.nodes.push(node);
    };
    NodeSet.prototype.contains = function (node) {
        var hash = hashNode(node);
        return hash in this.store;
    };
    NodeSet.prototype.toArray = function () {
        return [].concat(this.nodes);
    };
    return NodeSet;
}());
exports.NodeSet = NodeSet;
//# sourceMappingURL=css_utils.js.map