#! /usr/bin/env node
"use strict";
var commander = require("commander");
var css = require("css");
var css_utils_1 = require("../css_utils");
var ast_diff_1 = require("../ast_diff");
var collection_utils_1 = require("../collection_utils");
var StatusCode;
(function (StatusCode) {
    StatusCode[StatusCode["NOT_CHANGED"] = 0] = "NOT_CHANGED";
    StatusCode[StatusCode["ERROR"] = 1] = "ERROR";
    StatusCode[StatusCode["CHANGED"] = 2] = "CHANGED";
})(StatusCode || (StatusCode = {}));
var cli = commander
    .usage("[options] <file ...>")
    .option("-V, --verbose", "Display verbose diff")
    .parse(process.argv);
function astDiffByFiles(filePathA, filePathB, options) {
    css_utils_1.parseFiles(filePathA, filePathB)
        .then(function (tuple) { return ast_diff_1.astDiff(tuple[0], tuple[1]); })
        .then(function (result) {
        var changed = result.changed, extra = result.extra, missing = result.missing;
        if (changed) {
            if (options.verbose) {
                if (!collection_utils_1.isEmpty(extra)) {
                    console.log(formatNodes(extra, "extra"));
                }
                if (!collection_utils_1.isEmpty(missing)) {
                    console.log(formatNodes(missing, "missing"));
                }
            }
            console.log((extra.length + " extra rules and " + missing.length + " missing rules ") +
                ("between " + filePathA + " and " + filePathB));
        }
        return changed ? StatusCode.CHANGED : StatusCode.NOT_CHANGED;
    }, function (err) {
        return StatusCode.ERROR;
    })
        .then(function (statusCode) { return process.exit(statusCode); });
}
function formatNodes(nodes, msg) {
    return nodes
        .map(css_utils_1.createDummyStyleSheet)
        .map(function (styleSheet) { return css.stringify(styleSheet); })
        .map(function (cssString) { return (msg + ":\n" + indent(cssString)); })
        .join("\n\n");
}
function indent(str) {
    return str.split("\n").map(function (line) { return ("\t" + line); }).join("\n");
}
astDiffByFiles(cli.args[0], cli.args[1], {
    verbose: cli.opts().verbose,
});
