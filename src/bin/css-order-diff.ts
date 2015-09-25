/// <reference path="../typings/bundle.d.ts" />
/// <reference path="../typings/css/css.d.ts" />

import commander = require("commander");
import {values, isEmpty} from "../collection_utils";
import {parseFiles} from "../css_utils";
import {orderDiff} from "../order_diff";

enum StatusCode {
  NOT_CHANGED = 0,
  ERROR = 1,
  CHANGED = 2,
}

const cli = commander
  .usage("[options] <file ...>")
  .option("-V, --verbose", "Display verbose diff")
  .parse(process.argv);

type Options = {
  verbose: boolean;
};

const defaultOptions: Options = {
  verbose: false,
};

function orderDiffByFiles(filePathA: string, filePathB: string, options: Options = defaultOptions): void {
  parseFiles(filePathA, filePathB)
    .then((tuple) => orderDiff(tuple[0], tuple[1]))
    .then((result) => {
      Object.keys(result).forEach((selector) => {
        const {changed, uptrends, downtrends} = result[selector];

        if (changed) {
          console.log(`order changed: ${selector}`);

          if (options.verbose) {
            if (!isEmpty(uptrends)) {
              console.log(`\tbecome to be higher than:\n\t\t${uptrends.join(",\n\t\t")}`);
            }
            if (!isEmpty(downtrends)) {
              console.log(`\tbecome to be lower than:\n\t\t${downtrends.join(",\n\t\t")}`);
            }
          }
        }
      });

      const changed = values(result).some((entry) => entry.changed);
      return changed ? StatusCode.CHANGED : StatusCode.NOT_CHANGED;
    }, (err) => {
      console.error(err);
      return StatusCode.ERROR;
    })
    .then((statusCode) => process.exit(statusCode));
}

orderDiffByFiles(cli.args[0], cli.args[1], {
  verbose: cli.opts().verbose,
});
