#! /usr/bin/env node
"use strict";
var commander = require("commander");
var collection_utils_1 = require("../collection_utils");
var css_utils_1 = require("../css_utils");
var order_diff_1 = require("../order_diff");
var cli_utils_1 = require("../cli_utils");
var StatusCode;
(function (StatusCode) {
    StatusCode[StatusCode["NOT_CHANGED"] = 0] = "NOT_CHANGED";
    StatusCode[StatusCode["ERROR"] = 1] = "ERROR";
    StatusCode[StatusCode["CHANGED"] = 2] = "CHANGED";
})(StatusCode || (StatusCode = {}));
var cli = commander
    .version(cli_utils_1.getVersion())
    .usage("[options] <file ...>")
    .option("-V, --verbose", "Display verbose diff")
    .parse(process.argv);
var defaultOptions = {
    verbose: false,
};
function orderDiffByFiles(filePathA, filePathB, options) {
    if (options === void 0) { options = defaultOptions; }
    css_utils_1.parseFiles(filePathA, filePathB)
        .then(function (tuple) { return order_diff_1.orderDiff(tuple[0], tuple[1]); })
        .then(function (result) {
        var changedSelectors = Object.keys(result);
        changedSelectors.forEach(function (selector) {
            var _a = result[selector], uptrends = _a.uptrends, downtrends = _a.downtrends;
            console.log("order changed: " + selector);
            if (options.verbose) {
                if (!collection_utils_1.isEmpty(uptrends)) {
                    console.log("\tbecome to be lower than:\n\t\t" + uptrends.join(",\n\t\t") + "\n");
                }
                if (!collection_utils_1.isEmpty(downtrends)) {
                    console.log("\tbecome to be higher than:\n\t\t" + downtrends.join(",\n\t\t") + "\n");
                }
            }
        });
        return changedSelectors.length > 0 ? StatusCode.CHANGED : StatusCode.NOT_CHANGED;
    }, function (err) {
        console.error(err);
        return StatusCode.ERROR;
    })
        .then(function (statusCode) { return process.exit(statusCode); });
}
orderDiffByFiles(cli.args[0], cli.args[1], {
    verbose: cli.opts().verbose,
});
