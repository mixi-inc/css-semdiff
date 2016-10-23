#! /usr/bin/env node

import * as commander from "commander";
import * as css from "css";
import {orderDiff} from "../order_diff";
import {getVersion, getStyleSheetPair} from "../cli_utils";
import {formatOrderDiffResult, formatOrderDiffResultVerbose} from "../format/order_diff";
import {stringifyErrorLike} from "../error_utils";


enum StatusCode {
  NOT_CHANGED = 0,
  ERROR = 1,
  CHANGED = 2,
}


const cli = commander
  .version(getVersion())
  .usage("[options] <file ...>")
  .option("-V, --verbose", "Display verbose diff")
  .parse(process.argv);


interface Options {
  verbose: boolean;
}


function runOrderDiff(styleSheets: Promise<[css.Stylesheet, css.Stylesheet]>, options: Options): Promise<void> {
  return styleSheets
    .then((tuple) => orderDiff(tuple[0], tuple[1]))
    .then((result) => {
      console.log(options.verbose
        ? formatOrderDiffResultVerbose(result)
        : formatOrderDiffResult(result));

      const changedSelectors = Object.keys(result);
      return changedSelectors.length > 0
        ? StatusCode.CHANGED
        : StatusCode.NOT_CHANGED;
    })
    .catch((errorLike) => {
      console.error(`Error: ${stringifyErrorLike(errorLike)}`);
      return StatusCode.ERROR;
    })
    .then((statusCode) => {
      (<any> process).exitCode = statusCode;
    });
}


runOrderDiff(getStyleSheetPair(cli.args), {
  verbose: cli.opts().verbose,
});
