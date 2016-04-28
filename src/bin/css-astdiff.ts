#! /usr/bin/env node
/// <reference path="../typings/bundle.d.ts" />

import * as commander from "commander";
import {parseFiles} from "../css_utils";
import {astDiff} from "../ast_diff";
import {getVersion} from "../cli_utils";
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


function astDiffByFiles(filePathA: string, filePathB: string, options?: Options): void {
  parseFiles(filePathA, filePathB)
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


astDiffByFiles(cli.args[0], cli.args[1], {
  verbose: cli.opts().verbose,
});
