#! /usr/bin/env node

import {Promise} from "es6-promise";
import * as commander from "commander";
import * as css from "css";
import {astDiff} from "../ast_diff";
import {getVersion, getStyleSheetPair} from "../cli_utils";
import {formatAstDiffResult, formatAstDiffResultVerbose} from "../format/ast_diff";
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


function runAstDiff(styleSheets: Promise<[css.Stylesheet, css.Stylesheet]>, options: Options): Promise<void> {
  return styleSheets
    .then((tuple) => astDiff(tuple[0], tuple[1]))
    .then((result) => {
      const {changed} = result;

      console.log(options.verbose
        ? formatAstDiffResultVerbose(result)
        : formatAstDiffResult(result));

      return changed
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


runAstDiff(getStyleSheetPair(cli.args), {
  verbose: cli.opts().verbose,
});
