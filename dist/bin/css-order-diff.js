/// <reference path="../typings/bundle.d.ts" />
/// <reference path="../typings/css/css.d.ts" />
var commander = require("commander");
var collection_utils_1 = require("../collection_utils");
var css_utils_1 = require("../css_utils");
var order_diff_1 = require("../order_diff");
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
var defaultOptions = {
    verbose: false,
};
function orderDiffByFiles(filePathA, filePathB, options) {
    if (options === void 0) { options = defaultOptions; }
    css_utils_1.parseFiles(filePathA, filePathB)
        .then(function (tuple) { return order_diff_1.orderDiff(tuple[0], tuple[1]); })
        .then(function (result) {
        Object.keys(result).forEach(function (selector) {
            var _a = result[selector], changed = _a.changed, uptrends = _a.uptrends, downtrends = _a.downtrends;
            if (changed) {
                console.log("order changed: " + selector);
                if (options.verbose) {
                    if (!collection_utils_1.isEmpty(uptrends)) {
                        console.log("\tbecome to be higher than:\n\t\t" + uptrends.join(",\n\t\t") + "\n");
                    }
                    if (!collection_utils_1.isEmpty(downtrends)) {
                        console.log("\tbecome to be lower than:\n\t\t" + downtrends.join(",\n\t\t") + "\n");
                    }
                }
            }
        });
        var changed = collection_utils_1.values(result).some(function (entry) { return entry.changed; });
        return changed ? StatusCode.CHANGED : StatusCode.NOT_CHANGED;
    }, function (err) {
        console.error(err);
        return StatusCode.ERROR;
    })
        .then(function (statusCode) { return process.exit(statusCode); });
}
orderDiffByFiles(cli.args[0], cli.args[1], {
    verbose: cli.opts().verbose,
});
//# sourceMappingURL=css-order-diff.js.map