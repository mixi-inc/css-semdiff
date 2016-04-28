#! /usr/bin/env node
/// <reference path="../typings/bundle.d.ts" />
/// <reference path="../typings/css/css.d.ts" />

import * as commander from "commander";
import {parseFiles} from "../css_utils";
import {orderDiff} from "../order_diff";
import {getVersion} from "../cli_utils";
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


const defaultOptions: Options = {
  verbose: false,
};


function orderDiffByFiles(filePathA: string, filePathB: string, options: Options = defaultOptions): void {
  parseFiles(filePathA, filePathB)
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


orderDiffByFiles(cli.args[0], cli.args[1], {
  verbose: cli.opts().verbose,
});
